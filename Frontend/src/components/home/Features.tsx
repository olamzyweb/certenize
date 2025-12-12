import { motion } from 'framer-motion';
import { Brain, Shield, Zap, CheckCircle } from 'lucide-react';

const VITE_APP_NAME = import.meta.env.VITE_APP_NAME || 'Certenize';

const features = [
  {
    icon: Brain,
    title: 'AI-Generated Assessments',
    description: 'Dynamic questions powered by artificial intelligence, tailored to any topic you choose.',
  },
  {
    icon: Shield,
    title: 'Soulbound Tokens',
    description: 'Non-transferable NFTs that prove your knowledge authentically and permanently.',
  },
  {
    icon: Zap,
    title: 'Instant Verification',
    description: 'Anyone can verify your credentials on-chain in seconds. No middleman required.',
  },
  {
    icon: CheckCircle,
    title: 'Tamper-Proof',
    description: 'Blockchain-secured credentials that cannot be faked, edited, or revoked.',
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 pattern-dots opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            Why <span className="text-gradient">{VITE_APP_NAME}</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A new paradigm in educational credentials, combining AI and blockchain technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 rounded-2xl h-full hover-lift">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-display mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
