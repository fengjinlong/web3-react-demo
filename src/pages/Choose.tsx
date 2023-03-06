import { Button, Modal } from "antd";
import { useAtom } from "jotai";
import React from "react";
import { metaMask } from "../connectors/metaMask";
import { walletconnect } from "../connectors/walletConnector";
import { init } from "./WalletsComponent";
import { wallet } from "./Wallet";

interface C {
  val: boolean;
  open: (s: boolean) => void;
  setWallet: (s: string) => void;
}
export const Choose: React.FC<C> = (p: C) => {
  const [, setInit] = useAtom(init);
  const open = p.open;
  const setWallet = p.setWallet;
  const val = p.val;

  const [, setWall] = useAtom(wallet);
  // 关闭
  const close = (s: string) => {
    setInit(false);
    setWallet(s);
    open(false);
    if (s === "MetaMask") {
      setWall((v) => ({ ...v, connector: metaMask }));
    } else {
      setWall((v) => ({ ...v, connector: walletconnect }));
    }
  };

  return (
    <Modal
      title="选择钱包"
      open={val}
      onOk={() => open(false)}
      onCancel={() => open(false)}
    >
      <Button onClick={() => close("MetaMask")} type="primary" block>
        MetaMask
      </Button>
      <div style={{ margin: "20px" }}></div>
      <Button onClick={() => close("WalletConnect")} type="primary" block>
        WalletConnect
      </Button>
    </Modal>
  );
};
