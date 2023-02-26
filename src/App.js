import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import constants from "./constants/constants";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

export const injected = new InjectedConnector();
const ENS_ABI = constants.abi.goerli;
const ENS_ADDRESS = constants.address.goerli;

function App() {
  const [hasMetamask, setHasMetamask] = useState(false);

  const {
    active,
    activate,
    chainId,
    account,
    library: provider,
  } = useWeb3React();

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected);
        setHasMetamask(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Please download metamask");
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>ens subdomain infra</h1>
        <button className="header-button" onClick={connectWallet}>
          {hasMetamask ? "connected" : "connect wallet"}
        </button>
        {account}
      </div>
    </div>
  );
}

export default App;
