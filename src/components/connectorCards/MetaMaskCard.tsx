import { useEffect, useState } from "react";
import { hooks, metaMask } from "../../connectors/metaMask";
import { Card } from "../Card";

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;
export default function MetaMaskCard() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();
  console.log("provider", provider);
  const ensNames = useENSNames();

  // console.log("accounts", accounts);
  // console.log("provider", provider);
  // console.log("ensNames", ensNames);
  // console.log("chainId", chainId);
  // console.log("isActivating", isActivating);
  // console.log("isActive", isActive);

  const [error, setError] = useState(undefined);
  useEffect(() => {
    // 试探一下连接的状态是否有问题，并不是自动连接，自动连接调起 metaMask 用 request
    metaMask
      .connectEagerly()
      .then((res) => {
        console.log("1", res);
      })
      .catch((error) => {
        // setError(error);
      });
  }, []);
  return (
    <div>
      <div>Chain ID: {chainId}</div>
      <Card
        connector={metaMask}
        chainId={chainId}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        ENSNames={ensNames}
        accounts={accounts}
        setError={setError}
      />
    </div>
  );
}
