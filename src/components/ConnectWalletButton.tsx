import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton, WalletModalButton } from "@solana/wallet-adapter-react-ui";

// Renders "Connect Wallet" when not connected, and the standard multi button when connected
export const ConnectWalletButton: FC = () => {
  const { connected } = useWallet();

  if (connected) {
    return <WalletMultiButton />;
  }

  return <WalletModalButton>Connect Wallet</WalletModalButton>;
};

export default ConnectWalletButton;