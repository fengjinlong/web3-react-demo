import { Button } from "antd";
import { atom, useAtom } from "jotai";
import { SetStateAction, useState, Dispatch } from "react";
import { metaMask } from "../connectors/metaMask";
import MetaMaskMessage from "./accountsMessage/metaMaskMessage";
import WalletConnectMessage from "./accountsMessage/walletConnectMessage";
import { SelectChain } from "./SelectChain";
import { SelectChainWalletConnect } from "./SelectChainWalletconnect";

interface InitWallet {
  connector: any;
  chainId: number | undefined;
  isActivating: boolean;
  isActive: boolean;
  error: Error | undefined;
  setError: Dispatch<SetStateAction<undefined>>;
}
const ob: InitWallet = {
  connector: metaMask,
  chainId: 1,
  isActivating: false,
  isActive: false,
  error: undefined,
  setError: () => {},
};
export const wallet = atom(ob);

// 钱包类型

interface T {
  walletType: string;
}
export const Wallet: React.FC<T> = (t) => {
  // 钱包
  const [initWallet] = useAtom(wallet);
  const { walletType } = t;

  const [box, setBox] = useState(false);
  const openBox = () => {
    setBox((box) => !box);
  };

  // 获取钱包信息
  return (
    <div style={{ display: "flex" }}>
      <Button
        ghost
        onClick={openBox}
        style={{ margin: "10px", width: "250px" }}
        type="primary"
      >
        钱包类型： {walletType}
      </Button>
      {box ? (
        walletType === "MetaMask" ? (
          <MetaMaskMessage />
        ) : (
          <WalletConnectMessage />
        )
      ) : (
        ""
      )}
      <p
        style={{
          lineHeight: "52px",
          padding: "0 10px 0 30px",
          color: "#1677ff",
        }}
      >
        请选择网络:{" "}
      </p>
      {initWallet.connector === metaMask ? (
        <SelectChain
          connector={initWallet.connector}
          chainId={initWallet.chainId}
          isActivating={initWallet.isActivating}
          isActive={initWallet.isActive}
          error={initWallet.error}
          setError={initWallet.setError}
        />
      ) : (
        <SelectChainWalletConnect
          connector={initWallet.connector}
          chainId={initWallet.chainId}
          isActivating={initWallet.isActivating}
          isActive={initWallet.isActive}
          error={initWallet.error}
          setError={initWallet.setError}
        />
      )}
    </div>
  );
};
