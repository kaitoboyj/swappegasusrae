import { SwapInterface } from '@/components/SwapInterface';
import { PegasusAnimation } from '@/components/PegasusAnimation';
import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <PegasusAnimation />
      <Navigation />

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-8">
        {/* Main Swap Interface */}
        <div className="flex justify-center items-center">
          <SwapInterface />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          <p>Built with ⚡ on Solana</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
