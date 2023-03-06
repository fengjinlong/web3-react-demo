import { useEffect, useMemo, useState } from "react";
import { hooks, metaMask } from "../../connectors/metaMask";
import { Message } from "./Message";

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  // useProvider,
  useENSNames,
} = hooks;
export default function MetaMaskMessage() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  // const provider = useProvider();
  const ensNames = useENSNames();

  const [error, setError] = useState(undefined);

  // 重置 select

  useEffect(() => {
    // 试探一下连接的状态是否有问题，并不是自动连接，自动连接调起 metaMask 用 request
    metaMask
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
        status={status}
        accounts={accounts}
        connector={metaMask}
      />
    </div>
  );
}
