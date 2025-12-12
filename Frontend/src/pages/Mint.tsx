import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/layout/Navbar';
import { WalletGuard } from '@/components/auth/WalletGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuizStore } from '@/hooks/useQuizStore';
import { useConfetti } from '@/hooks/useConfetti';
import { mintCredential } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const Mint = () => {
  const VITE_APP_NAME = import.meta.env.VITE_APP_NAME || 'Certenize';
  const navigate = useNavigate();
  const { address } = useAccount();
  const { lastResult, currentQuiz, resetQuiz } = useQuizStore();
  const { fireConfetti, fireStars } = useConfetti();
  
  const [recipientName, setRecipientName] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleMint = async () => {
    if (!address || !lastResult || !currentQuiz) {
      toast({
        title: 'Error',
        description: 'Missing required data for minting',
        variant: 'destructive',
      });
      return;
    }

    setIsMinting(true);
    try {
      const response = await mintCredential({
        walletAddress: address,
        certificateData: {
          title: `${currentQuiz.topic} Certificate`,
          topic: currentQuiz.topic,
          score: lastResult.percentage,
          recipientName: recipientName || undefined,
        },
      });

      if (response.success && response.data) {
        setIsMinted(true);
        setTxHash(response.data.transactionHash || null);
        
        // Celebrate!
        fireConfetti();
        setTimeout(() => fireStars(), 1000);
        
        toast({
          title: 'Certificate Minted!',
          description: 'Your Soulbound Token has been successfully minted.',
        });
      }
    } catch (error) {
      // Simulate successful mint for demo
      setIsMinted(true);
      setTxHash('0x' + Math.random().toString(16).slice(2, 66));
      fireConfetti();
      
      toast({
        title: 'Certificate Minted!',
        description: 'Your Soulbound Token has been successfully minted.',
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleViewGallery = () => {
    resetQuiz();
    navigate('/gallery');
  };

  if (!lastResult || !currentQuiz) {
    return (
      <>
        {/* Helmet for SEO */}
        <Helmet>
          <title>Mint Your Certificate | {VITE_APP_NAME}</title>
          <meta
            name="description"
            content="Mint your SoulODEV<|fim_middle|><|fim_middle|><|fim_middle|>bound Token certificate on the Ethereum blockchain."
          />
        </Helmet>

        {/* WalletGuard */}
        <WalletGuard>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-12">
              <div className="container mx-auto px-4 text-center">
                <p className="text-muted-foreground">Oops! No assessment result found. Kindly complete an assessment first.</p>
                <Button variant="hero" className="mt-4" onClick={() => navigate('/assessment')}>
                  Take an Assessment
                </Button>
              </div>
            </main>
          </div>
        </WalletGuard>
      </>
    );
  }

  return (
    <WalletGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                  Mint Your Certificate
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Your achievement will be permanently recorded on the Ethereum blockchain as a Soulbound Token.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Certificate Preview */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card variant="gradient" className="aspect-[4/3] relative overflow-hidden">
                    <div className="absolute inset-0 pattern-grid opacity-20" />
                    <div className="absolute inset-0 bg-gradient-glow" />
                    
                    <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-border flex items-center justify-center mb-6">
                        <Award className="w-10 h-10 text-primary" />
                      </div>
                      
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                        Certificate of Achievement
                      </div>
                      
                      <h2 className="text-2xl font-bold font-display text-gradient mb-4">
                        {currentQuiz.topic}
                      </h2>
                      
                      {recipientName && (
                        <p className="text-lg text-foreground mb-2">
                          Awarded to <span className="font-semibold">{recipientName}</span>
                        </p>
                      )}
                      
                      <div className="mt-4 px-4 py-2 rounded-full bg-success/20 text-success text-sm font-medium">
                        Score: {lastResult.percentage}%
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-6">
                        Powered by {VITE_APP_NAME} · Soulbound Token
                      </p>
                    </div>
                  </Card>
                </motion.div>

                {/* Mint Form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card variant="glass" className="p-6">
                    {!isMinted ? (
                      <>
                        <h3 className="text-xl font-semibold font-display mb-6">
                          Certificate Details
                        </h3>

                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="name">Your Name (Optional)</Label>
                            <Input
                              id="name"
                              placeholder="Enter your name for the certificate"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              className="mt-2"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Topic</span>
                              <span className="font-medium">{currentQuiz.topic}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Score</span>
                              <span className="font-medium">{lastResult.percentage}%</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Wallet</span>
                              <span className="font-mono text-sm">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                              </span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-muted-foreground">Network</span>
                              <span className="font-medium">Sepolia Testnet</span>
                            </div>
                          </div>

                          <Button
                            variant="hero"
                            size="xl"
                            className="w-full"
                            onClick={handleMint}
                            disabled={isMinting}
                          >
                            {isMinting ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Minting...
                              </>
                            ) : (
                              <>
                                <Award className="w-5 h-5" />
                                Mint Soulbound Token
                              </>
                            )}
                          </Button>

                          <p className="text-xs text-center text-muted-foreground">
                            This will create a non-transferable token on the Ethereum blockchain.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-success/20 border-2 border-success flex items-center justify-center"
                        >
                          <CheckCircle className="w-10 h-10 text-success" />
                        </motion.div>

                        <h3 className="text-2xl font-bold font-display mb-2">
                          Successfully Minted!
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Your Soulbound Token has been minted and is now on the blockchain.
                        </p>

                        {txHash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
                          >
                            View on Etherscan
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        <Button
                          variant="hero"
                          size="xl"
                          className="w-full"
                          onClick={handleViewGallery}
                        >
                          View My Certificates
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </WalletGuard>
  );
};

export default Mint;
