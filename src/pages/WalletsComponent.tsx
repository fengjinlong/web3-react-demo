import { Button } from "antd";
import { atom, useAtom } from "jotai";
import { useCallback, useState } from "react";
import { Choose } from "./Choose";
import "./com.css";
import { Wallet } from "./Wallet";
export const init = atom(true);
export const WalletsComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const click = useCallback((s: boolean) => {
    setIsModalOpen((s) => !s);
  }, []);
  const Btn: React.FC = () => {
    return (
      <Button
        onClick={() => click(true)}
        style={{ margin: "10px", width: "250px" }}
        type="primary"
        ghost
      >
        选择钱包
      </Button>
    );
  };
  const [wallet, setWallet] = useState("");

  const [initBtn] = useAtom(init);
  return (
    <div className="pages">
      {/* 钱包 */}
      {initBtn ? <Btn /> : <Wallet walletType={wallet} />}

      <Choose val={isModalOpen} open={click} setWallet={setWallet} />
    </div>
  );
};
