import React from "react";
import MetaMaskCard from "./components/connectorCards/MetaMaskCard";
import WalletConnectCard from "./components/connectorCards/WalletConnectCard";
import * as buffer from "buffer";

if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
}
if (typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = buffer.Buffer;
}
function App() {
  return (
    <div className="App">
      <MetaMaskCard />
      <WalletConnectCard />
    </div>
  );
}

export default App;
