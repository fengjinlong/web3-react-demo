import type { BigNumber } from "@ethersproject/bignumber";
import { Web3ReactHooks } from "@web3-react/core";
import { useEffect, useState } from "react";
import { formatEther } from "@ethersproject/units";
function useBalance(
  provider?: ReturnType<Web3ReactHooks["useProvider"]>,
  accounts?: string[]
) {
  const [balance, setBalance] = useState<BigNumber[] | undefined>();
  useEffect(() => {
    if (provider && accounts?.length) {
      let stale = false;
      Promise.all(accounts.map((account) => provider.getBalance(account))).then(
        (balances) => {
          if (!stale) {
            setBalance(balances);
          }
        }
      );
      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [accounts, provider]);
  return balance;
}
export function Accounts({
  accounts,
  provider,
  ENSNames,
}: {
  accounts: ReturnType<Web3ReactHooks["useAccounts"]>;
  provider: ReturnType<Web3ReactHooks["useProvider"]>;
  ENSNames: ReturnType<Web3ReactHooks["useENSNames"]>;
}) {
  const balance = useBalance(provider, accounts);
  if (accounts === undefined)
    return (
      <div>
        Accounts: <b>None</b>
      </div>
    );
  return (
    <div>
      Accounts:{" "}
      <b>
        {accounts.length === 0
          ? "None"
          : accounts?.map((account, index) => (
              <ul
                key={account}
                style={{
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {ENSNames?.[index] ?? account}
                {balance?.[index] ? `${formatEther(balance[index])}` : null}
              </ul>
            ))}
      </b>
    </div>
  );
}
