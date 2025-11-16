import { useState, useEffect } from 'react';
import { ArrowDownUp, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TokenSearch } from './TokenSearch';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

interface TokenPrice {
  price: number;
  symbol: string;
}

interface SwapInterfaceProps {
  defaultFromToken?: Token;
  defaultToToken?: Token;
  onFromTokenChange?: (token: Token) => void;
}

const QUICKNODE_RPC = 'https://few-greatest-card.solana-mainnet.quiknode.pro/96ca284c1240d7f288df66b70e01f8367ba78b2b';

export const SwapInterface = ({
  defaultFromToken,
  defaultToToken,
  onFromTokenChange
}: SwapInterfaceProps = {}) => {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [fromToken, setFromToken] = useState<Token | undefined>(defaultFromToken);
  const [toToken, setToToken] = useState<Token | undefined>(defaultToToken);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isSwapping, setIsSwapping] = useState(false);
  const [fromBalance, setFromBalance] = useState<number>(0);
  const [fromBalanceUSD, setFromBalanceUSD] = useState<number>(0);
  const [fromTokenPrice, setFromTokenPrice] = useState<number>(0);
  const [toTokenPrice, setToTokenPrice] = useState<number>(0);

  // Fetch token balance using Jupiter Lite API
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey || !fromToken) {
        setFromBalance(0);
        setFromBalanceUSD(0);
        return;
      }

      try {
        // Use Jupiter Lite API for token balances
        const response = await fetch(`https://lite-api.jup.ag/ultra/v1/balances/${publicKey.toBase58()}`);
        const data = await response.json();
        
        // Jupiter API returns tokens keyed by symbol (SOL) or address
        let balance = 0;
        
        if (fromToken.address === 'So11111111111111111111111111111111111111112') {
          // SOL is returned with "SOL" key
          if (data.SOL && data.SOL.uiAmount) {
            balance = data.SOL.uiAmount;
          }
        } else {
          // Other tokens are keyed by their address
          if (data[fromToken.address] && data[fromToken.address].uiAmount) {
            balance = data[fromToken.address].uiAmount;
          }
        }
        
        setFromBalance(balance);
        setFromBalanceUSD(balance * fromTokenPrice);
      } catch (error) {
        console.error('Error fetching balance:', error);
        // Fallback to RPC if Jupiter API fails
        try {
          const connection = new Connection(QUICKNODE_RPC);
          
          if (fromToken.address === 'So11111111111111111111111111111111111111112') {
            const balance = await connection.getBalance(publicKey);
            const solBalance = balance / 1e9;
            setFromBalance(solBalance);
            setFromBalanceUSD(solBalance * fromTokenPrice);
          } else {
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
              publicKey,
              { mint: new PublicKey(fromToken.address) }
            );

            if (tokenAccounts.value.length > 0) {
              const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
              setFromBalance(balance || 0);
              setFromBalanceUSD((balance || 0) * fromTokenPrice);
            } else {
              setFromBalance(0);
              setFromBalanceUSD(0);
            }
          }
      } catch (rpcError) {
          console.error('Error fetching balance from RPC:', rpcError);
          setFromBalance(0);
          setFromBalanceUSD(0);
        }
      }
    };

    fetchBalance();
  }, [connected, publicKey, fromToken, fromTokenPrice]);

  // Fetch token prices using Jupiter Lite API
  useEffect(() => {
    const fetchTokenPrice = async (token: Token | undefined, setter: (price: number) => void) => {
      if (!token) return;

      try {
        const response = await fetch(`https://lite-api.jup.ag/price/v3?ids=${token.address}`);
        const data = await response.json();
        
        if (data[token.address] && data[token.address].usdPrice) {
          setter(data[token.address].usdPrice);
        } else {
          setter(0);
        }
      } catch (error) {
        console.error('Error fetching token price:', error);
        setter(0);
      }
    };

    fetchTokenPrice(fromToken, setFromTokenPrice);
    fetchTokenPrice(toToken, setToTokenPrice);
  }, [fromToken, toToken]);

  // Calculate toAmount based on prices when fromAmount changes
  useEffect(() => {
    if (fromAmount && fromTokenPrice > 0 && toTokenPrice > 0) {
      const fromValue = parseFloat(fromAmount) * fromTokenPrice;
      const calculatedToAmount = fromValue / toTokenPrice;
      setToAmount(calculatedToAmount.toFixed(6));
    } else if (!fromAmount) {
      setToAmount('');
    }
  }, [fromAmount, fromTokenPrice, toTokenPrice]);

  const handleFromTokenSelect = (token: Token) => {
    if (toToken && token.address === toToken.address) {
      setToToken(fromToken);
    }
    setFromToken(token);
    onFromTokenChange?.(token);
  };

  const handleToTokenSelect = (token: Token) => {
    if (fromToken && token.address === fromToken.address) {
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
    if (toToken) {
      onFromTokenChange?.(toToken);
    }
  };

  const handlePercentageClick = (percentage: number) => {
    if (fromBalance > 0) {
      const amount = fromBalance * percentage;
      setFromAmount(amount.toFixed(6));
    }
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !publicKey || !sendTransaction) {
      toast.error('Please connect wallet and enter amount');
      return;
    }

    setIsSwapping(true);
    try {
      console.log('Starting swap process...');
      
      const amountInSmallestUnit = Math.floor(parseFloat(fromAmount) * Math.pow(10, fromToken.decimals));
      const slippageBps = Math.floor(parseFloat(slippage) * 100); // Convert to basis points

      // Get quote from Jupiter
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.address}&outputMint=${toToken.address}&amount=${amountInSmallestUnit}&slippageBps=${slippageBps}`
      );
      
      if (!quoteResponse.ok) {
        throw new Error('Failed to get swap quote');
      }

      const quoteData = await quoteResponse.json();
      console.log('Quote received:', quoteData);

      // Get swap transaction
      const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteResponse: quoteData,
          userPublicKey: publicKey.toString(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 'auto'
        })
      });

      if (!swapResponse.ok) {
        throw new Error('Failed to get swap transaction');
      }

      const { swapTransaction } = await swapResponse.json();
      console.log('Swap transaction received');

      // Deserialize and send transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      toast.info('Confirm transaction in your wallet...');

      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        maxRetries: 3,
        preflightCommitment: 'confirmed'
      });

      toast.info('Confirming swap...');
      console.log('Transaction signature:', signature);

      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash('finalized');
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      }, 'confirmed');

      toast.success('Swap completed successfully!');
      console.log('Swap confirmed');

      // Reset form
      setFromAmount('');
      setToAmount('');

    } catch (error: any) {
      console.error('Swap error:', error);
      
      let errorMessage = 'Swap failed';
      if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Selling</label>
            {connected && publicKey && fromToken && (
              <div className="text-xs font-medium">
                <span className="text-muted-foreground">Balance: </span>
                <span className="text-foreground">{fromBalance.toFixed(6)} {fromToken.symbol}</span>
                <span className="text-muted-foreground ml-2">(${fromBalanceUSD.toFixed(2)})</span>
              </div>
            )}
          </div>
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
                {connected && publicKey && fromAmount && fromTokenPrice > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    ${(parseFloat(fromAmount) * fromTokenPrice).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            {/* Percentage Buttons */}
            {connected && publicKey && fromBalance > 0 && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handlePercentageClick(0.25)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 hover:bg-muted transition-all"
                >
                  25%
                </button>
                <button
                  onClick={() => handlePercentageClick(0.5)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 hover:bg-muted transition-all"
                >
                  50%
                </button>
                <button
                  onClick={() => handlePercentageClick(0.75)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 hover:bg-muted transition-all"
                >
                  75%
                </button>
                <button
                  onClick={() => handlePercentageClick(1)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-primary to-secondary text-white transition-all"
                >
                  MAX
                </button>
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
                  readOnly
                  className="text-3xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-right"
                />
                {connected && publicKey && toAmount && toTokenPrice > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    ${(parseFloat(toAmount) * toTokenPrice).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
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
      </div>
    </motion.div>
  );
};
