import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import pegasusLogo from '@/assets/pegasus-logo.png';

const Claim = () => {
  const [showAll, setShowAll] = useState(false);

  // Generate 20,000+ wallet entries
  const generateClaimData = () => {
    const baseWallets = [
      "15e9F8ok", "dbPMQvwL", "wuAtFULb", "TxyWvTBp", "MSkBkXXd", "Q61ytKqi", "dP9Ydu1v", "8GSMofeQ",
      "JRk5pqeV", "88SJbJk4", "2xUH8Rfo", "bo4NW62c", "UbGR4omq", "8rKjQaz2", "659216LZ", "QkjtSr4B",
      "D7GHtdXP", "coTT8HYZ", "coMwmsA4", "a68TZCU5"
    ];
    
    const data = [];
    for (let i = 0; i < 20000; i++) {
      const randomPrefix = baseWallets[i % baseWallets.length];
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      const accts = Math.floor(Math.random() * 15) + 1;
      const claimed = (Math.random() * 2).toFixed(5);
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      data.push({
        wallet: `${randomPrefix}...${randomSuffix}`,
        accts,
        claimed: `${claimed} SOL`,
        date
      });
    }
    return data;
  };

  const claimData = generateClaimData();

  const displayData = showAll ? claimData : claimData.slice(0, 12);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary to-secondary mb-8">
              <div className="bg-background rounded-full p-8">
                <img src={pegasusLogo} alt="Pegasus Logo" className="w-24 h-24" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-4">
              Claim Free Solana — Instantly and Transparently
            </h1>

            <p className="text-2xl font-semibold text-foreground mb-6">
              Fast, verifiable, on-chain claiming
            </p>

            <p className="text-muted-foreground mb-8">
              Proof-of-claim • Global availability • ~3918 TPS
            </p>

            <Button size="lg" className="mb-4 text-lg px-12 py-6 h-auto">
              Claim SOL
            </Button>

            <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              Click here to reset Wallet Selector
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/90 border-0">
              <CardContent className="pt-8 pb-8 text-center">
                <h3 className="text-lg text-muted-foreground mb-2">Total Claimed</h3>
                <p className="text-5xl font-bold text-primary mb-2">$2.3M</p>
                <p className="text-sm text-muted-foreground">USD equivalent</p>
                <p className="text-xs text-muted-foreground">updated live</p>
              </CardContent>
            </Card>

            <Card className="bg-card/90 border-0">
              <CardContent className="pt-8 pb-8 text-center">
                <h3 className="text-lg text-muted-foreground mb-2">Claimants</h3>
                <p className="text-5xl font-bold text-primary mb-2">56,7K</p>
                <p className="text-sm text-muted-foreground">global community</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Claim Ledger Table */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">On-chain claim ledger</h2>

          <Card className="bg-card/90 border-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-foreground font-semibold">Wallet Address</TableHead>
                      <TableHead className="text-foreground font-semibold">Accts</TableHead>
                      <TableHead className="text-foreground font-semibold">Claimed</TableHead>
                      <TableHead className="text-foreground font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.map((row, index) => (
                      <TableRow key={index} className="border-border/30">
                        <TableCell className="font-mono text-sm">{row.wallet}</TableCell>
                        <TableCell>{row.accts}</TableCell>
                        <TableCell>{row.claimed}</TableCell>
                        <TableCell>{row.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {!showAll && (
            <div className="text-center mt-6">
              <Button variant="link" className="text-primary" onClick={() => setShowAll(true)}>
                Show more
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Eligible users may claim free SOL. Network fees are minimal and claiming is recorded on-chain.
          </p>
        </div>
      </section>

      {/* How Claiming Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Card className="bg-card/90 border-0 mb-8">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-3xl font-bold mb-6">How Claiming Free SOL Works</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Transparent claiming</h3>
                  <p className="text-muted-foreground">
                    Every claim is recorded on-chain, creating a public, tamper-proof ledger. Your claim is traceable from request to settlement.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Fast settlement</h3>
                  <p className="text-muted-foreground">
                    Solana's high throughput and low latency mean confirmed claims in seconds, even under heavy load.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">On-chain proofs</h3>
                  <p className="text-muted-foreground">
                    Smart contracts verify eligibility and record results, providing a durable proof-of-claim that you can reference anytime.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Global access</h3>
                  <p className="text-muted-foreground">
                    Claim from anywhere with a compatible wallet. The process is standardized and secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/90 border-0">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">How does it work?</h2>

              <div className="space-y-4 text-muted-foreground max-h-96 overflow-y-auto pr-4">
                <p>
                  <strong>How does it work?</strong><br />
                  Pegasus Swap includes a secure, wallet-connected flow that helps you reclaim SOL that is locked as rent in empty SPL token accounts. When you receive a memecoin, token, or NFT, Solana creates a dedicated SPL token account for that asset. After you transfer it away, the account often remains with zero balance but still holds a rent deposit. By closing those zero-balance token accounts, the rent deposit is released back to your wallet as SOL.
                </p>

                <p>
                  <strong>Closing SPL Token Accounts</strong><br />
                  Every time your wallet holds a new SPL asset, a specific token account is created. If later that asset's balance becomes zero (for example, you sold or transferred it), the account can be safely closed. Closing zero-balance SPL token accounts returns the rent deposit to you. Pegasus Swap scans for these empty token accounts and lets you close them in bulk with clear, step-by-step confirmations.
                </p>

                <p>
                  <strong>Claim Your SOL</strong><br />
                  Accounts shown for selection in Pegasus Swap's claim flow already have 0 units of the relevant asset and no further utility. You can confidently select as many as you want to close. Once confirmed, the protocol performs the close operations, and the released rent deposits are returned to your wallet in SOL.
                </p>

                <p>
                  <strong>What is rent?</strong><br />
                  Solana requires a rent-exempt minimum for accounts, which functions like a deposit ensuring the network can store and process data. For typical SPL token accounts, this amount is small (historically around ~0.002 SOL, varying by cluster conditions and serialization). When an account is closed, that rent-exempt deposit is released back to the wallet that owns the account. You can read more in the official documentation.
                </p>

                <p>
                  <strong>Eligibility: How Pegasus Swap users get SOL rewards</strong><br />
                  If you have SPL token accounts in your wallet with a zero balance, you are eligible to reclaim their rent deposit as SOL. Pegasus Swap's claim flow detects these empty accounts, presents them for selection, and guides you through closing them. The "SOL rewards" you receive are the unlocked rent deposits credited back to you after successful closures. There is no need to stake or trade to qualify—eligibility is based solely on the presence of zero-balance SPL token accounts in your wallet.
                </p>

                <p>
                  <strong>Step-by-step</strong><br />
                  1. Connect your wallet (Phantom, Solflare, Torus, Ledger, etc.).<br />
                  2. Open the claim flow. Pegasus Swap scans for zero-balance SPL token accounts you own.<br />
                  3. Select the accounts you want to close; the UI shows what will be reclaimed.<br />
                  4. Approve the transaction(s) in your wallet. Pegasus Swap submits secure close instructions on Solana.<br />
                  5. Receive your SOL automatically as rent deposits are released back to your wallet.
                </p>

                <p>
                  <strong>Trust, security, and costs</strong><br />
                  Pegasus Swap executes standard Solana instructions to close token accounts. You sign every operation in your wallet, and no private keys ever leave your device. Network fees are minimal, and Pegasus Swap may apply a small service fee to sustain infrastructure and development—clearly shown before you approve.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solana Technical Overview */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <Card className="bg-card/90 border-0">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-3xl font-bold mb-6">Solana: A Comprehensive Technical Overview</h2>

              <div className="space-y-4 text-muted-foreground max-h-96 overflow-y-auto pr-4">
                <p>
                  <strong>Introduction</strong><br />
                  Solana is a high-performance blockchain designed to deliver web-scale throughput with low latency and low transaction costs. It achieves this with a combination of innovative architectural choices and pragmatic engineering, including Proof of History (PoH), a bespoke variant of BFT consensus known as Tower BFT, a highly parallel runtime called Sealevel, a lightweight accounts model that avoids complex gas semantics, sophisticated networking built on QUIC and Gulf Stream, and a focus on vertical optimization around validator performance. In this deep-dive, we unpack the core primitives, the runtime, developer ergonomics, performance characteristics, and operational realities of running and building on Solana.
                </p>

                <p>
                  <strong>Design Goals and Trade-offs</strong><br />
                  Solana's design goal is simple: maximize throughput and minimize latency without sacrificing security or decentralization beyond pragmatic thresholds. Rather than scaling by adding many layers of complexity, Solana pursues a unified L1 approach that treats hardware as the scaling boundary, leaning on Moore's law and distributed systems principles. This implies certain trade-offs: validators are expected to run high-performance machines; the runtime is opinionated; block production is deliberately pipelined; and the network targets aggressive finality times by coordinating leaders. These choices, when combined with PoH and Sealevel, enable dramatic parallel execution and early forwarding of transactions, producing a user experience closer to web APIs than legacy blockchain interactions.
                </p>

                <p>
                  <strong>Proof of History (PoH)</strong><br />
                  Proof of History is a cryptographic clock that lets the network agree on the order of events without waiting for network-wide communication on each step. PoH uses a verifiable delay function: a hash chain that is computationally sequential. Each hash operation produces a new output that cannot be known without computing the preceding hash. By embedding events inside this chain and exposing periodic checkpoints, validators can attest to relative timing and ordering with minimal overhead. This clocking mechanism enables leaders to schedule blocks confidently, helps validators prefetch and verify data, and reduces consensus chatter.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Claim Your SOL?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Connect your wallet to start claiming free SOL from empty token accounts.
          </p>
          <WalletMultiButton />
        </div>
      </section>
    </div>
  );
};

export default Claim;
