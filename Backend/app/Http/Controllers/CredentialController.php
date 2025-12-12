<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Credential;
use App\Models\QuizSession;
use Illuminate\Support\Facades\Log;
use Web3\Web3;
use Web3\Contract;
use Web3\Providers\HttpProvider;
use Web3\RequestManagers\HttpRequestManager;
use Web3p\EthereumTx\Transaction;
use kornrunner\Keccak;

class CredentialController extends Controller
{
    public function mint(Request $req)
    {
        $req->validate([
            'mint_token' => 'required|string'
        ]);

        try {
            $session = QuizSession::where('mint_token', $req->mint_token)
                ->where('status', 'passed')
                ->firstOrFail();

            $rpcUrl = env('RPC_URL');
            $privateKey = env('PRIVATE_KEY'); // without 0x prefix is fine
            $contractAddress = env('CONTRACT_ADDRESS', '0xe6b3794191523de54a03a685fdd786b313b1788c');
            $fromAddress = env('FROM_ADDRESS'); // recommended; if empty will try to derive (not implemented here)

            if (!$rpcUrl || !$privateKey) {
                return response()->json(['success' => false, 'error' => 'RPC_URL or PRIVATE_KEY not set in .env'], 500);
            }

            // Normalize private key (remove 0x if present)
            $privateKey = ltrim($privateKey, '0x');

            // Validate wallet address format
            if (!preg_match('/^0x[a-fA-F0-9]{40}$/', $session->wallet_address)) {
                return response()->json(['success' => false, 'error' => 'Invalid wallet address format.'], 400);
            }

            // Setup web3 with a longer timeout
            $timeout = (int)env('RPC_TIMEOUT', 30);
            $requestManager = new HttpRequestManager($rpcUrl, $timeout);
            $provider = new HttpProvider($requestManager);
            $web3 = new Web3($provider);

            // --- Build NFT metadata (string) ---
            $metadata = [
                'name' => $session->topic,
                'description' => 'Cred-AI verified skill',
                'attributes' => [
                    ['trait_type' => 'Score', 'value' => (string)$session->score]
                ]
            ];
            $metadataJson = json_encode($metadata, JSON_UNESCAPED_SLASHES);

            // --- Encode mintTo(address, string) manually (selector + ABI encode) ---
            $functionSignature = 'mintTo(address,string)';
            $selector = substr(Keccak::hash($functionSignature, 256), 0, 8); // first 4 bytes -> 8 hex chars

            // Head:
            // param1 (address) => 32 bytes (right-aligned in 32 bytes)
            // param2 (string)  => offset (0x40) because head size = 2 * 32 = 64 bytes = 0x40
            $addressPadded = str_pad(ltrim($session->wallet_address, '0x'), 64, '0', STR_PAD_LEFT);
            $offset = str_pad(dechex(0x40), 64, '0', STR_PAD_LEFT); // offset for dynamic param

            // Tail (dynamic data for string):
            $metadataHex = bin2hex($metadataJson);
            $metadataByteLength = strlen(hex2bin($metadataHex));
            $metadataLenHex = str_pad(dechex($metadataByteLength), 64, '0', STR_PAD_LEFT);

            // pad metadata to 32 byte chunks
            $mod = strlen($metadataHex) % 64; // 64 hex chars = 32 bytes
            if ($mod !== 0) {
                $metadataHex = $metadataHex . str_repeat('0', 64 - $mod);
            }

            $data = '0x' . $selector . $addressPadded . $offset . $metadataLenHex . $metadataHex;

            // --- Get nonce ---
            $nonce = null;
$web3->eth->getTransactionCount($fromAddress, 'pending', function ($err, $count) use (&$nonce) {
    if ($err !== null) {
        throw new \Exception('getTransactionCount error: ' . $err->getMessage());
    }
    $nonce = $count; // BigInteger object
});

// Wait until $nonce is set (if async)
$waitTime = 0;
while ($nonce === null && $waitTime < 10) {
    usleep(100_000); // 0.1 sec
    $waitTime++;
}

if ($nonce === null) {
    return response()->json(['success' => false, 'error' => 'Failed to fetch nonce.'], 500);
}

// Convert BigInteger to int
if ($nonce instanceof \phpseclib\Math\BigInteger) {
    $nonceInt = (int)$nonce->toString();
} elseif (is_string($nonce)) {
    $nonceInt = hexdec(ltrim($nonce, '0x'));
} else {
    $nonceInt = (int)$nonce;
}
            // --- Build legacy transaction (simpler for compatibility) ---
            $gasPrice = 50 * 1_000_000_000;  // 50 gwei
            $gasLimit = 400000;

            $txArray = [
                'nonce' => '0x' . dechex($nonceInt),
                'to' => $contractAddress,
                'value' => '0x0',
                'data' => $data,
                'gas' => '0x' . dechex($gasLimit),
                'gasPrice' => '0x' . dechex($gasPrice),
                'chainId' => $this->getChainId($rpcUrl)
            ];

            // --- Sign with web3p/ethereum-tx ---
            $tx = new Transaction($txArray);
            $signed = $tx->sign($privateKey); // returns signed raw hex string WITHOUT 0x prefix in some versions
            $signedHex = (strpos($signed, '0x') === 0) ? $signed : '0x' . $signed;

            // --- Send raw transaction ---
            $txHash = null;
            $error = null;
            $web3->eth->sendRawTransaction($signedHex, function ($err, $tx) use (&$txHash, &$error) {
                if ($err) {
                    $error = $err->getMessage();
                    return;
                }
                $txHash = $tx;
            });

            if ($error !== null) {
                Log::error('SBT Minting Error', ['error' => $error, 'wallet' => $session->wallet_address, 'session_id' => $session->id]);
                if (strpos($error, 'Unsupported method') !== false || strpos($error, 'eth_sendTransaction') !== false) {
                    return response()->json(['success' => false, 'error' => 'RPC provider does not support eth_sendTransaction. Use sendRawTransaction and ensure cryptographic libs are available.'], 500);
                }
                return response()->json(['success' => false, 'error' => 'Transaction failed: ' . $error], 500);
            }

            if (empty($txHash)) {
                Log::error('SBT Minting Error: No transaction hash returned', ['wallet' => $session->wallet_address, 'session_id' => $session->id]);
                return response()->json(['success' => false, 'error' => 'Transaction sent but no tx hash returned.'], 500);
            }

            // Save credential record
            $cred = Credential::create([
                'wallet_address' => $session->wallet_address,
                'quiz_session_id' => $session->id,
                'token_id' => null,
                'transaction_hash' => $txHash,
                'skill' => $session->topic,
                'score' => $session->score,
                'minted_at' => now()
            ]);

            return response()->json(['success' => true, 'transaction' => ['transactionHash' => $txHash], 'credential_id' => $cred->id]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'error' => 'Quiz session not found or not passed.'], 404);
        } catch (\Exception $e) {
            Log::error('SBT Minting Exception', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['success' => false, 'error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Very small helper: decide chainId by RPC URL (override by CHAIN_ID env if set)
     */
    private function getChainId($rpcUrl)
    {
        $chainId = env('CHAIN_ID');
        if (!empty($chainId)) {
            return (int)$chainId;
        }

        if (strpos($rpcUrl, 'sepolia') !== false) return 11155111;
        if (strpos($rpcUrl, 'goerli') !== false) return 5;
        if (strpos($rpcUrl, 'mainnet') !== false) return 1;
        return 11155111;
    }

    public function walletCredentials($wallet)
    {
        return Credential::where('wallet_address', $wallet)->get();
    }
}
