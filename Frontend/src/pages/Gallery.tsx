import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Loader2, Inbox } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/layout/Navbar';
import { WalletGuard } from '@/components/auth/WalletGuard';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { getCredentials } from '@/lib/api';
import type { Certificate } from '@/types';
import { Helmet } from 'react-helmet-async';

const Gallery = () => {
  const VITE_APP_NAME = import.meta.env.VITE_APP_NAME || 'Certenize';
  const { address } = useAccount();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!address) return;
      
      setLoading(true);
      try {
        const response = await getCredentials(address);
        if (response.success && response.data) {
          setCertificates(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [address]);

  return (
    <>
      {/* Helmet for SEO */}
      <Helmet>
        <title>Certificate Gallery | {VITE_APP_NAME}</title>
        <meta
          name="description"
          content="View all your Soulbound Tokens and earned credentials in the Certificate Gallery."
        />
      </Helmet>

      {/* WalletGuard */}
      <WalletGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card mb-6">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Your Credentials</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                  Certificate Gallery
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  All your Soulbound Tokens are displayed here. These credentials are permanently stored on the blockchain.
                </p>
              </motion.div>

              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading your certificates...</p>
                  </motion.div>
                </div>
              ) : certificates.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
                    <Inbox className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold font-display mb-2">
                    No Certificates Yet
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Complete a quiz and earn your first Soulbound Token!
                  </p>
                  <a href="/quiz">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                    >
                      Take a Quiz
                    </motion.button>
                  </a>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {certificates.map((certificate, index) => (
                    <motion.div
                      key={certificate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CertificateCard certificate={certificate} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Stats Section */}
              {certificates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                  {[
                    { label: 'Total Certificates', value: certificates.length },
                    { label: 'Average Score', value: `${Math.round(certificates.reduce((acc, c) => acc + c.score, 0) / certificates.length)}%` },
                    { label: 'Topics Covered', value: new Set(certificates.map(c => c.topic)).size },
                    { label: 'Minted on Chain', value: certificates.filter(c => c.minted).length },
                  ].map((stat, index) => (
                    <div key={index} className="glass-card p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold font-display text-gradient">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </WalletGuard>
    </>
  );
};

export default Gallery;
