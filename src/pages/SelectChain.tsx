import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { Button, Select } from "antd";
import { Contract } from "ethers";
import InfoAbi from "../abi/InfoContract.json";
import { useAtom } from "jotai";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CHAINS, getAddChainParameters } from "../connectors/chains";

import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";

import { init } from "./WalletsComponent";

import { wallet } from "./Wallet";

const { useChainId, useIsActivating, useIsActive, useProvider, useENSNames } =
  metaMaskHooks;

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
  // const ensNames = useENSNames();

  const [, setWall] = useAtom(wallet);
  const [error, setError] = useState(undefined);
  useEffect(() => {
    setWall({
      connector: metaMask,
      chainId: chainId2,
      isActivating: isActivating,
      isActive: isActive,
      error: error,
      setError: setError,
    });
  }, [chainId, isActivating, isActive, error]);
  return (
    <Select
      value={chainId2}
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
export const SelectChain: React.FC<Props> = ({
  connector,
  chainId,
  isActivating,
  isActive,
  error,
  setError,
}: Props) => {
  const [desiredChainId, setDesiredChainId] = useState<number>(1);
  const [, setWall] = useAtom(wallet);
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

  //重头戏 链接成功
  const provider = useProvider();

  // const ENSNames = useENSNames(provider);
  const [isPending, setPending] = useState(false);
  // const [error, setError] = useState(undefined);

  const address = InfoAbi.networks[43113].address;
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
          .then(() => {
            setWall((v) => ({ ...v, chainId: desiredChainId }));
            setError(undefined);
          })
          .catch(setError);
      } else {
        console.log("connector", connector);
        connector
          .activate(
            desiredChainId === -1
              ? undefined
              : getAddChainParameters(desiredChainId)
          )
          .then(() => {
            setWall((v) => ({ ...v, chainId: desiredChainId }));
            setError(undefined);
          })
          .catch(setError);
      }
    },
    [chainId, connector, setError]
  );
  const [, setInit] = useAtom(init);
  const displayDefault = false;
  const chainIds = Object.keys(CHAINS).map((chainId) => Number(chainId));

  // console.log("chainId", chainId);
  // console.log("isActivating", isActivating);
  // console.log("isActive", isActive);

  /**
   * @description: 调度合约
   * @param {*} useCallback
   * @return {*}
   */
  const schedulContract = useCallback(async () => {
    setPending(true);
    const signer = await provider?.getSigner();
    if (provider) {
      const contract = new Contract(address, InfoAbi.abi, signer);
      const result = await contract.setInfo(
        "laoyuan",
        parseInt((Math.random() * 20).toString(), 10)
      );
      const transactionReceipt = await provider?.waitForTransaction(
        result.hash
      );
      console.log(
        "监听当前hash挖掘的收据交易状态【为1代表交易成功、为0代表交易失败】transactionReceipt.status：",
        transactionReceipt?.status
      );
      console.log(
        "监听当前hash挖掘的收据交易event事件日志transactionReceipt.logs：",
        transactionReceipt?.logs
      );
      // console.log(
      //   "transactionReceipt",
      //   transactionReceipt,
      //   transactionReceipt?.status === 1 && transactionReceipt.logs.length !== 0
      // );
      if (
        transactionReceipt?.status === 1
        // transactionReceipt.logs.length !== 0
      ) {
        //大大的loading
        setPending(false);
      }
      // 待处理
      setPending(false);
    }
  }, []);
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
        <div style={{ marginBottom: "1rem" }} />
        {chainId === 43113 ? (
          <Button onClick={schedulContract} type="primary" disabled={isPending}>
            调度合约
          </Button>
        ) : (
          ""
        )}
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
