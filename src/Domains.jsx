import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import constants from "./constants/constants";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "whiycWcW9NS-2DF3nBWhi4fogmFkJDcQ",
  network: Network.ETH_GOERLI
}

const alchemy = new Alchemy(settings);

export const injected = new InjectedConnector();
const ENS_ABI = constants.abi.controller;
const ENS_ADDRESS = constants.address.controller;
const RESOLVER_ADDRESS = constants.address.resolver;

function Domains() {
 
  const [hasMetamask, setHasMetamask] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [commitment, setCommitment] = useState("");

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

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    console.log(registeredName)
    const signer = provider.getSigner()
    const contractObject = new ethers.Contract(ENS_ADDRESS, ENS_ABI, signer)
    const makeCommitTx = await contractObject.makeCommitment(registeredName, account, '0x7375706572736563726574000000000000000000000000000000000000000000');
    console.log(makeCommitTx)
    const commitTx = await contractObject.commit(makeCommitTx);
    console.log(commitTx);
  }
 
  async function register() {
    const signer = provider.getSigner()
    const contractObject = new ethers.Contract(ENS_ADDRESS, ENS_ABI, signer)  
    const registerTx = await contractObject.registerWithConfig(registeredName, account, 94670856, '0x7375706572736563726574000000000000000000000000000000000000000000', RESOLVER_ADDRESS, account, {value: ethers.utils.parseEther('0.2', 'ether')});
    console.log(registerTx);
  }

  return (
    <div className="app">
      <div className="header">
        <h1>ens subdomain infra</h1>
        <div className="account-info-div">
          <a href="/subdomains"><button className="header-button">subdomains</button></a>
          <a href="/domains"><button className="header-button">domains</button></a>
          {account}
          <button className="header-button" onClick={connectWallet}>
            {hasMetamask ? "connected" : "connect wallet"}
          </button>
        </div>
      </div>
      <div className="input-div">
        <input value={registeredName} type="text" onKeyDown={handleKeyDown} onChange={(e) => setRegisteredName(e.target.value)}/>
        <h1 className="input-h1">{registeredName}.eth</h1>
        <button className="header-button" onClick={register}>register</button>
      </div>
    </div>
  );
}

export default Domains;