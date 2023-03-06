import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect";
import { URLS } from "./chains";

/**
 * actions 状态管理
 * WalletConnect 钱包相关的操作
 * options 配置
 * rpc 当前支持的链
 */
export const [walletconnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        rpc: URLS,
      },
    })
);
