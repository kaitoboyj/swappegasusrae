import { useState } from 'react';
import { ArrowDownUp, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TokenSearch } from './TokenSearch';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

interface SwapInterfaceProps {
  defaultFromToken?: Token;
  defaultToToken?: Token;
  onFromTokenChange?: (token: Token) => void;
}

export const SwapInterface = ({
  defaultFromToken,
  defaultToToken,
  onFromTokenChange
}: SwapInterfaceProps = {}) => {
  const { connected, publicKey } = useWallet();
  const [fromToken, setFromToken] = useState<Token | undefined>(defaultFromToken);
  const [toToken, setToToken] = useState<Token | undefined>(defaultToToken);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleFromTokenSelect = (token: Token) => {
    if (toToken && token.address === toToken.address) {
      // Swap tokens if selecting same token
      setToToken(fromToken);
    }
    setFromToken(token);
    onFromTokenChange?.(token);
  };

  const handleToTokenSelect = (token: Token) => {
    if (fromToken && token.address === fromToken.address) {
      // Swap tokens if selecting same token
      setFromToken(toToken);
    }
    setToToken(token);
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!fromToken || !toToken || !fromAmount) {
      toast.error('Please select tokens and enter amount');
      return;
    }

    setIsSwapping(true);
    try {
      // TODO: Implement Jupiter swap logic
      toast.success('Swap initiated! (Demo mode)');
    } catch (error) {
      toast.error('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-3xl border border-white/10 max-w-lg w-full relative overflow-hidden"
    >
      {/* Animated glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl opacity-20 blur-xl animate-pulse-glow" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gradient">Swap</h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 glass-card rounded-xl hover:glow-effect transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <WalletMultiButton />
          </div>
        </div>

        {/* From Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Selling</label>
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between gap-4">
              <TokenSearch selectedToken={fromToken} onSelectToken={handleFromTokenSelect} />
              <div className="flex-1 text-right">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="text-3xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-right"
                />
                {connected && publicKey && (
                  <div className="text-xs text-muted-foreground mt-1">
                    $0.00
                  </div>
                )}
              </div>
            </div>
            {connected && publicKey && (
              <div className="text-xs text-muted-foreground mt-3">
                Balance: 0.00
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-20">
          <button
            onClick={handleSwapTokens}
            className="p-3 glass-card rounded-xl hover:scale-110 hover:rotate-180 transition-all duration-300 hover:glow-effect"
          >
            <ArrowDownUp className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Buying</label>
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between gap-4">
              <TokenSearch selectedToken={toToken} onSelectToken={handleToTokenSelect} />
              <div className="flex-1 text-right">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  className="text-3xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-right"
                />
                {connected && publicKey && (
                  <div className="text-xs text-muted-foreground mt-1">
                    $0.00
                  </div>
                )}
              </div>
            </div>
            {connected && publicKey && (
              <div className="text-xs text-muted-foreground mt-3">
                Balance: 0.00
              </div>
            )}
          </div>
        </div>

        {/* Swap Settings */}
        <div className="mt-4 glass-card p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Slippage Tolerance</span>
            <div className="flex items-center gap-2">
              {['0.1', '0.5', '1.0'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    slippage === value
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <Input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-16 text-center"
              />
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!connected || isSwapping || !fromToken || !toToken || !fromAmount}
          className="w-full mt-6 h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-primary via-secondary to-accent hover:scale-[1.02] transition-all shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!connected ? (
            'Connect Wallet'
          ) : isSwapping ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Swapping...
            </div>
          ) : (
            'Swap Tokens'
          )}
        </Button>

        {/* Powered by Jupiter */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Powered by Jupiter Aggregator
        </div>
      </div>
    </motion.div>
  );
};
