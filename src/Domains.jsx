import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import constants from "./constants/constants";

import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "whiycWcW9NS-2DF3nBWhi4fogmFkJDcQ",
  network: Network.ETH_GOERLI
}

const alchemy = new Alchemy(settings);


const ENS_ABI = constants.abi.controller;
const ENS_ADDRESS = constants.address.controller;
const RESOLVER_ADDRESS = constants.address.resolver;

function Domains({ web3 }) {
 
  
  const [registeredName, setRegisteredName] = useState("");
  const [commitment, setCommitment] = useState("");



  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    console.log(web3)
    const signer = web3.library.getSigner()
    const contractObject = new ethers.Contract(ENS_ADDRESS, ENS_ABI, signer)
    const makeCommitTx = await contractObject.makeCommitmentWithConfig(registeredName, web3.account, '0x7375706572736563726574000000000000000000000000000000000000000000', RESOLVER_ADDRESS, web3.account);
    console.log(makeCommitTx)
    const commitTx = await contractObject.commit(makeCommitTx);
    console.log(commitTx);
  }
 
  async function register() {
    console.log('registeredname: ', registeredName)
    console.log('account: ', web3.account)
    
    
    const signer = web3.library.getSigner()
    const contractObject = new ethers.Contract(ENS_ADDRESS, ENS_ABI, signer)  
    const registerTx = await contractObject.registerWithConfig(registeredName, web3.account, 31556952, '0x7375706572736563726574000000000000000000000000000000000000000000', RESOLVER_ADDRESS, web3.account, {value: ethers.utils.parseEther('0.5', 'ether')});
    console.log(registerTx);
  }

  return (
    <div className="input-div">
      <input value={registeredName} type="text" onKeyDown={handleKeyDown} onChange={(e) => setRegisteredName(e.target.value)}/>
      <h1 className="input-h1">{registeredName}.eth</h1>
      <button className="header-button" onClick={register}>register</button>
    </div>
  );
}

export default Domains;