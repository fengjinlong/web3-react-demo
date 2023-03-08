import { WalletConnect } from "@web3-react/walletconnect";
import { Button } from "antd";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { getAddChainParameters } from "../../connectors/chains";
import { init } from "../WalletsComponent";
interface Me {
  status: string;
  accounts: string[] | undefined;
  connector: any;
  isActive: boolean;
  error: Error | undefined;
}
export const Message: React.FC<Me> = (p: Me) => {
  const [, setInit] = useAtom(init);
  const Btns = ({
    connector,
    error,
    isActive,
  }: {
    connector: any;
    error: Error | undefined;
    isActive: boolean;
  }) => {
    const onClick = useCallback(() => {
      // setError(undefined);
      if (connector instanceof WalletConnect) {
        connector.activate(undefined);
        // .then(() => setError(undefined))
        // .catch(setError);
      } else {
        connector.activate(getAddChainParameters(1));
        // .then(() => setError(undefined))
        // .catch(setError);
      }
    }, [connector]);

    if (error) {
      return (
        <Button danger onClick={onClick}>
          再试一次
        </Button>
      );
    } else if (isActive) {
      return (
        <Button
          danger
          onClick={() => {
            setInit(true);
            if (connector?.deactivate) {
              connector.deactivate();
            } else {
              connector.resetState();
            }
          }}
        >
          断开
        </Button>
      );
    } else {
      return (
        <button
          onClick={
            () =>
              connector instanceof WalletConnect
                ? connector.activate(undefined)
                : // .then(() => setError(undefined))
                  // .catch(setError)
                  connector.activate(getAddChainParameters(1))
            // .then(() => setError(undefined))
            // .catch(setError)
          }
        >
          Connect
        </button>
      );
    }
  };
  return (
    <div
      style={{
        width: "300px",
        height: "300px",
        margin: "-10px 10px",
        borderRadius: "8px",
        fontSize: "16px",
        color: "#1677ff",
        position: "absolute",
        top: "60px",
        left: "0px",
        border: "1px solid #1677ff",
        padding: "20px",
        backgroundColor: "rgba(255,255,0,.8)",
      }}
    >
      <h2>账户: </h2>
      <p
        style={{
          paddingBottom: "20px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {p.accounts}
      </p>
      <h2>连接状态：</h2>
      <p style={{ paddingBottom: "20px" }}>{p.status}</p>

      <Btns connector={p.connector} error={p.error} isActive={p.isActive} />
    </div>
  );
};
