import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import constants from "./constants/constants";
import "./App.css";

export default function NewDomain({ web3 }) {

  const [typedName, setTypedName] = useState("");

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      handleSubmit();
    }
  }

  async function handleSubmit() {
    // todo sanitize typedName, check for connected wallet
    const signer = web3.library.getSigner();
    const controllerContract = new ethers.Contract(constants.address.controller, constants.abi.controller, signer);
    const makeCommitTx = await controllerContract.makeCommitWithConfig(typedName, web3.account, '0x7375706572736563726574000000000000000000000000000000000000000000', constants.address.resolver, web3.account);
    await makeCommitTx.wait();
    console.log(makeCommitTx);
  }

  return (
    <div className="new-domains-div">
      <h1 className="new-domains-title">register a new domain</h1>
      <input className="new-domains-input" value={typedName} type="text" onKeyDown={handleKeyDown} onChange={(e) => setTypedName(e.target.value)}/>
    </div>
  )
}