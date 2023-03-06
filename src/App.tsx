import React from "react";
// import MetaMaskCard from "./components/connectorCards/MetaMaskCard";
// import WalletConnectCard from "./components/connectorCards/WalletConnectCard";
import * as buffer from "buffer";
import "antd/dist/reset.css";
import { WalletsComponent } from "./pages/WalletsComponent";

if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
}
if (typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = buffer.Buffer;
}
const App: React.FC = () => {
  return (
    <div className="App">
      <WalletsComponent />
      {/* <MetaMaskCard />
      <WalletConnectCard /> */}
    </div>
  );
};

export default App;
