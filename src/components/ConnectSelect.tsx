import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { CHAINS, getAddChainParameters } from "../connectors/chains";

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
  return (
    <select
      value={chainId}
      onChange={(e) => switchChain?.(e.target.value as any)}
      disabled={!switchChain}
    >
      {displayDefault && <option value="-1">Default</option>}
      {chainIds?.map((chainId) => (
        <option key={chainId} value={chainId}>
          {chainId}
        </option>
      ))}
    </select>
  );
}

export function ConnectWithSelect({
  connector,
  chainId,
  isActivating,
  isActive,
  error,
  setError,
}: {
  connector: MetaMask | WalletConnect;
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
  error: Error | undefined;
  setError: Dispatch<SetStateAction<undefined>>;
}) {
  const [desiredChainId, setDesiredChainId] = useState<number>(-1);
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
  const displayDefault = false;
  const chainIds = Object.keys(CHAINS).map((chainId) => Number(chainId));
  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ChainSelect
          chainId={desiredChainId}
          switchChain={switchChain}
          displayDefault={displayDefault}
          chainIds={chainIds}
        />
        <div style={{ marginBottom: "1rem" }}></div>
        <button onClick={onClick}>Try again</button>
      </div>
    );
  } else if (isActive) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ChainSelect
          chainId={desiredChainId}
          switchChain={switchChain}
          displayDefault={displayDefault}
          chainIds={chainIds}
        />
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => {
              if (connector?.deactivate) {
                connector.deactivate();
              } else {
                connector.resetState();
              }
            }}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ChainSelect
          chainId={desiredChainId}
          switchChain={switchChain}
          displayDefault={displayDefault}
          chainIds={chainIds}
        />
        <div style={{ marginBottom: "1rem" }} />
        <button
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
          Connect
        </button>
      </div>
    );
  }
}
