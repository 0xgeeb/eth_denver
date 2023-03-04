import { useState, useEffect } from "react";
import "./App.css";
import constants from "./constants/constants";
import {ethers} from "ethers";
import convertToParentNode from "./utils/utils";

const textEncoder = new TextEncoder();
const RESOLVER_ADDRESS = constants.address.resolver;
const REGISTRY_ABI = constants.abi.registryWithFallback;
const REGISTRY_ADDRESS = constants.address.registryWithFallback;


export default function SelectedDomain({ web3, name }) {
  const [subdomain, setSubdomain] = useState("")
  const [mintingPage, setMintingPage] = useState(false)

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      handleSubmit()
    }
  }

  async function handleSubdomainChange(e) {
    e.preventDefault();
    setSubdomain(e.target.value)
  }

  async function handleSubmit() {
    setMintingPage(true);
    const signer = web3.library.getSigner();
    const contract = new ethers.Contract(
      REGISTRY_ADDRESS,
      REGISTRY_ABI,
      signer
    );
    const parentNode = convertToParentNode({name})
    const subdomainHash = ethers.utils.keccak256(
      textEncoder.encode(subdomain)
    );
    console.log("subdomain is ", subdomain)
    console.log("parentnode is ",parentNode)
    console.log("subdomainhash is ",subdomainHash)
    try {
       await contract.setSubnodeRecord(parentNode, subdomainHash, web3.account, RESOLVER_ADDRESS, 0);
     } catch (e) {
       console.log(e);
     }
  }

  return (
  <div className='selected-domain-container'>
    <h1 className='selected-domain-name'>Selected Domain: {name}</h1>
    <form>
        <label className="enter-subdomain-label" htmlFor="subdomain-input">Mint Subdomain:</label>
        <div className="input-subdomain-container">
        <p className="absolute-ending">.{name}</p>
        <input
          className="subdomain-input"
          type="text"
          id="subdomain-input"
          value={subdomain}
          onKeyDown={handleKeyDown}
          onChange={(e) => {handleSubdomainChange(e)}}
        />
        </div>
      </form>
  </div>
  );
}
