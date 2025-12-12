import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const VITE_APP_NAME = import.meta.env.VITE_APP_NAME || 'Soulbound Academy';
  const { isConnected } = useAccount();

  return (
    <>
      {/* Helmet for SEO */}
      <Helmet>
        <title>Home | {VITE_APP_NAME}</title>
        <meta
          name="description"
          content={`${VITE_APP_NAME} - Your gateway to earning and showcasing Soulbound Tokens and credentials.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <Hero />
          <Features />
          
          {/* CTA Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-card p-8 sm:p-12 rounded-3xl text-center max-w-3xl mx-auto"
              >
                <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                  Ready to Prove Your Knowledge?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Start your first assessment today and earn blockchain-verified credentials that last forever.
                </p>
                {isConnected && (
                  <Link to="/assessment">
                    <Button variant="hero" size="xl" className="group">
                      Take Your First Assessment
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center">
                    <span className="text-sm font-bold font-display text-gradient">C</span>
                  </div>
                  <span className="font-semibold font-display">{VITE_APP_NAME}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} {VITE_APP_NAME}. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Home;
