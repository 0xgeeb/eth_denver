import React, { useState } from "react"
import { ethers } from "ethers"
import constants from "./constants/constants"

export default function LockENS({ web3 }) {

  const [wrappedYet, setWrappedYet] = useState(false)

  const textEncoder = new TextEncoder();

  function submitHandler() {
    if(!wrappedYet) {
      wrapENS()
    }
    // const signer = web3.library.getSigner()
    // const contract = new ethers.Contract(
    //   constants.address.manager,
    //   constants.abi.manager,
    //   signer
    // )
  }

  async function wrapENS() {
    const signer = web3.library.getSigner()
    const contract = new ethers.Contract(
      constants.address.nameWrapper,
      constants.abi.nameWrapper,
      signer
    )
    console.log(web3.account)
    console.log(constants.address.resolver)
    console.log(constants.address.nameWrapper)
    await contract.wrapETH2LD("boston", web3.account, 0, constants.address.resolver)
  }

  function renderButton() {
    if(!wrappedYet) {
      return 'wrap'
    }
    else {
      return 'lock'
    }
  }

  return (
    <div className="lock-ens-container">
      <h1 className="lock-ens-title">lock your ens in the subdomain manager contract</h1>
      <h1 className="lock-ens-name">wakaflocka.eth</h1>
      <button className="lock-ens-button" onClick={() => submitHandler()}>{renderButton()}</button>
    </div>
  )
}