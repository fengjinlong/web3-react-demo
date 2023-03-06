import { useEffect, useMemo, useState } from "react";
import { hooks, walletconnect } from "../../connectors/walletConnector";
import { Message } from "./Message";

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;
export default function WalletConnectMessage() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();
  const ensNames = useENSNames();

  const [error, setError] = useState(undefined);
  useEffect(() => {
    console.log("wwww");
    // 试探一下连接的状态是否有问题，并不是自动连接，自动连接调起 walletConnector 用 request
    walletconnect
      .connectEagerly()
      .then((res) => {
        console.log("1", res);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const status = useMemo(() => {
    return error
      ? "🔴 {error}"
      : isActivating
      ? "🟡 Connecting"
      : isActive
      ? "🟢 Connected"
      : "⚪️ Disconnected";
  }, [error, isActivating, isActive]);

  return (
    <div>
      <Message
        error={error}
        isActive={isActive}
        connector={walletconnect}
        status={status}
        accounts={accounts}
      />
      {/* <Card
        connector={walletconnect}
        chainId={chainId}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        ENSNames={ensNames}
        accounts={accounts}
        setError={setError}
      /> */}
    </div>
  );
}
