import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface WalletGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export function WalletGuard({ children, redirectTo }: WalletGuardProps) {
  const { isConnected, isConnecting } = useAccount();

  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Connecting wallet...</p>
        </motion.div>
      </div>
    );
  }

  if (!isConnected) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background pattern-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="glass-card p-8 rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold font-display mb-3">
              Connect Your Wallet
            </h2>
            
            <p className="text-muted-foreground mb-6">
              To access this feature, please connect your Ethereum wallet. Your credentials will be securely minted as Soulbound Tokens.
            </p>

            <div className="flex justify-center">
              <ConnectButton />
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Supported on Sepolia Testnet. Make sure you have some test ETH for gas fees.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
