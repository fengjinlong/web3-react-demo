// 以太坊
import type { AddEthereumChainParameter } from "@web3-react/types";
// export interface AddEthereumChainParameter {
//     chainId: number;
//     chainName: string;
//     nativeCurrency: {
//         name: string;
//         symbol: string;
//         decimals: 18;
//     };
//     rpcUrls: string[];
//     blockExplorerUrls?: string[];
//     iconUrls?: string[];
// }
const ETH: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Ethereum",
  symbol: "ETH",
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
}
interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
  blockExplorerUrls?: string[];
}
// 链子的下拉菜单

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
} = {
  1: {
    urls: [`https://mainnet.infura.io/v3/${process.env.infuraKey}`],
    name: "Ethereum Mainnet",
  },
  3: {
    urls: ["https://ropsten.infura.io/v3/"],
    name: "Ropsten Testnet",
  },
};
