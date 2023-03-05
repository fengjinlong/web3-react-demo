import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";

export function getName(connector: any) {
  if (connector instanceof MetaMask) {
    return "MetaMask";
  }
  if (connector instanceof WalletConnect) {
    return "WalletConnect";
  }
  return "Unknown";
}
