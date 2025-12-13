import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Certificate } from '@/types';

interface CertificateCardProps {
  certificate: Certificate;
  onClick?: () => void;
}

export function CertificateCard({ certificate, onClick }: CertificateCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="glass" className="overflow-hidden hover-lift cursor-pointer group" onClick={onClick}>
        {/* Certificate Preview */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary to-background border-b border-border overflow-hidden">
          <div className="absolute inset-0 pattern-grid opacity-30" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-border flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Certificate of Completion
            </div>
            <h3 className="text-lg font-bold font-display text-gradient line-clamp-2">
              {certificate.title}
            </h3>
          </div>

          {/* Minted Badge */}
          {certificate.minted && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              Minted
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {certificate.topic}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
              Score: {certificate.score}%
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Issued</span>
              <span>{formatDate(certificate.issueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-mono text-xs">
                {truncateAddress(certificate.recipientAddress)}
              </span>
            </div>
            {certificate.tokenId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token ID</span>
                <span className="font-mono">#{certificate.tokenId}</span>
              </div>
            )}
          </div>

        <div className="mt-2 flex flex-col gap-2">
          {/* Etherscan – only if minted */}
          {certificate.transactionHash && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  `https://sepolia.etherscan.io/tx/${certificate.transactionHash}`,
                  '_blank'
                );
              }}
            >
              View on Etherscan
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          )}
        
          {/* LinkedIn – ALWAYS visible */}
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              const shareUrl = encodeURIComponent(
                `https://yourapp.com/certificate/${certificate.id}`
              );
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                '_blank',
                'width=600,height=600'
              );
            }}
          >
            Share on LinkedIn
          </Button>
        </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
