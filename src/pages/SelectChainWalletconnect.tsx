import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { Button, Select } from "antd";
import { useAtom } from "jotai";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CHAINS, getAddChainParameters } from "../connectors/chains";

import { hooks, walletconnect } from "../connectors/walletConnector";

import { init } from "./WalletsComponent";

import { wallet } from "./Wallet";

const {
  useChainId,
  useIsActivating,
  useIsActive,
  // useProvider,
  useENSNames,
} = hooks;

function ChainSelect({
  chainId,
  displayDefault,
  chainIds,
  switchChain,
}: {
  chainId: number;
  displayDefault: boolean;
  chainIds?: number[];
  switchChain?: (chainId: number) => void;
}) {
  const chainId2 = useChainId();
  // const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  // const provider = useProvider();
  const ensNames = useENSNames();

  const [, setWall] = useAtom(wallet);
  const [error, setError] = useState(undefined);
  useEffect(() => {
    setWall({
      connector: walletconnect,
      chainId: chainId2,
      isActivating: isActivating,
      isActive: isActive,
      error: error,
      setError: setError,
    });
  }, [chainId, isActivating, isActive, error]);
  return (
    <Select
      value={chainId}
      style={{ width: 200, height: "100%", marginTop: "10px" }}
      onChange={(val) => switchChain?.(val)}
      disabled={!switchChain}
    >
      {/* {displayDefault && <option value="-1">Default</option>} */}
      {chainIds?.map((chainId) => (
        <Select.Option key={chainId} value={chainId}>
          {CHAINS[chainId]?.name ?? chainId}
        </Select.Option>
      ))}
    </Select>
  );
}

interface Props {
  connector: MetaMask | WalletConnect;
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
  error: Error | undefined;
  setError: Dispatch<SetStateAction<undefined>>;
}
export const SelectChainWalletConnect: React.FC<Props> = ({
  connector,
  chainId,
  isActivating,
  isActive,
  error,
  setError,
}: Props) => {
  const [desiredChainId, setDesiredChainId] = useState<number>(1);
  const onClick = useCallback(() => {
    setError(undefined);
    if (connector instanceof WalletConnect) {
      connector
        .activate(desiredChainId === -1 ? undefined : desiredChainId)
        .then(() => setError(undefined))
        .catch(setError);
    } else {
      connector
        .activate(
          desiredChainId === -1
            ? undefined
            : getAddChainParameters(desiredChainId)
        )
        .then(() => setError(undefined))
        .catch(setError);
    }
  }, [connector, desiredChainId, setError]);

  /**
   * @description: 切链
   * @return {*}
   */
  const switchChain = useCallback(
    (desiredChainId: number) => {
      console.log("desiredChainId", desiredChainId);
      setDesiredChainId(desiredChainId);
      if (desiredChainId === chainId) {
        setError(undefined);
        return;
      }
      if (desiredChainId === -1 && chainId === undefined) {
        setError(undefined);
        return;
      }
      if (connector instanceof WalletConnect) {
        console.log("connector", connector);
        connector
          .activate(desiredChainId === -1 ? undefined : desiredChainId)
          .then(() => setError(undefined))
          .catch(setError);
      } else {
        connector
          .activate(
            desiredChainId === -1
              ? undefined
              : getAddChainParameters(desiredChainId)
          )
          .then(() => setError(undefined))
          .catch(setError);
      }
    },
    [chainId, connector, setError]
  );
  const [, setInit] = useAtom(init);
  const displayDefault = false;
  const chainIds = Object.keys(CHAINS).map((chainId) => Number(chainId));

  console.log("chainId", chainId);
  console.log("isActivating", isActivating);
  console.log("isActive", isActive);
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "yellow",
          padding: "0 10px 10px 10px",
          border: "1px solid #1677ff",
          borderRadius: "3px",
        }}
      >
        <ChainSelect
          chainId={desiredChainId}
          switchChain={switchChain}
          displayDefault={displayDefault}
          chainIds={chainIds}
        />
        <div style={{ marginBottom: "1rem" }}></div>
        <Button danger onClick={onClick}>
          连接失败，再试一次
        </Button>
      </div>
    );
  } else if (isActive) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "yellow",
          border: "1px solid #1677ff",
          padding: "0 10px 10px 10px",
          borderRadius: "3px",
        }}
      >
        <ChainSelect
          chainId={desiredChainId}
          switchChain={switchChain}
          displayDefault={displayDefault}
          chainIds={chainIds}
        />
        <div style={{ marginBottom: "1rem" }} />
        <Button
          type="primary"
          ghost
          onClick={() => {
            setInit(true);
            if (connector?.deactivate) {
              connector.deactivate();
            } else {
              connector.resetState();
            }
          }}
        >
          连接成功，点击断开连接
        </Button>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "yellow",
          border: "1px solid #1677ff",
          padding: "0 10px 10px 10px",
          borderRadius: "3px",
        }}
      >
        <ChainSelect
          chainId={desiredChainId}
          switchChain={switchChain}
          displayDefault={displayDefault}
          chainIds={chainIds}
        />
        <div style={{ marginBottom: "1rem" }} />
        <Button
          type="primary"
          ghost
          onClick={
            isActivating
              ? undefined
              : () =>
                  connector instanceof WalletConnect
                    ? connector
                        .activate(
                          desiredChainId === -1 ? undefined : desiredChainId
                        )
                        .then(() => setError(undefined))
                        .catch(setError)
                    : connector
                        .activate(
                          desiredChainId === -1
                            ? undefined
                            : getAddChainParameters(desiredChainId)
                        )
                        .then(() => setError(undefined))
                        .catch(setError)
          }
        >
          点击连接
        </Button>
      </div>
    );
  }
};
