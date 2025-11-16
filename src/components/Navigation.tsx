import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import pegasusLogo from '@/assets/pegasus-logo.png';

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 animated-gradient-nav backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 h-18 flex items-center justify-between">
        {/* Logo & Title */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <motion.img
            src={pegasusLogo}
            alt="Pegasus"
            className="w-12 h-12"
            animate={{
              rotateY: [0, 15, -15, 0],
              y: [0, -3, 0],
              filter: [
                'drop-shadow(0 0 8px hsl(195 100% 60% / 0.6))',
                'drop-shadow(0 0 16px hsl(195 100% 60% / 0.8))',
                'drop-shadow(0 0 8px hsl(195 100% 60% / 0.6))'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <h1 className="text-2xl font-extrabold text-gradient">
            Pegasus Swap
          </h1>
        </Link>

        {/* Navigation Links & Wallet */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Swap
            {location.pathname === '/' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <Link
            to="/dex"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/dex'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            DEX
            {location.pathname === '/dex' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <Link
            to="/why-pegasus"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/why-pegasus'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Why Pegasus
            {location.pathname === '/why-pegasus' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <Link
            to="/claim"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/claim'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Claim
            {location.pathname === '/claim' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <Link
            to="/charity"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/charity'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Charity
            {location.pathname === '/charity' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
};
