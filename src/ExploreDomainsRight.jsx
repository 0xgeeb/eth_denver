import { useState, useEffect } from "react";
import "./App.css";
import constants from "./constants/constants";
import {ethers} from "ethers";
import convertToParentNode from "./utils/utils";
import {FaSpinner} from "react-icons/fa"

const textEncoder = new TextEncoder();
const RESOLVER_ADDRESS = constants.address.resolver;
const REGISTRY_ABI = constants.abi.registryWithFallback;
const REGISTRY_ADDRESS = constants.address.registryWithFallback;


export default function ExploreDomainsRight({ web3, name }) {
  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [mintPage, setMintPage] = useState(false);

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      handleSubmit(event)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const signer = web3.library.getSigner()
    const contract = new ethers.Contract(
      constants.address.manager,
      constants.abi.manager,
      signer
    )

    const x0 = 0;
    const x1 = ethers.utils.keccak256(textEncoder.encode("eth"));
    const eth = ethers.utils.solidityKeccak256(
        ["uint256", "bytes32"],
        [x0, x1]
        );
    const labelHash = ethers.utils.keccak256(
            textEncoder.encode(name.split(".")[0])
    );
    const parentNode = ethers.utils.solidityKeccak256(
        ["bytes32", "bytes32"],
        [eth, labelHash]
    );
    console.log(constants.address.manager)
    console.log(parentNode)
    await contract.mintSubdomain(parentNode, subdomain)
    setLoading(false);
    setMintPage(true);
  }

  return (
  <div className='selected-domain-container'>
    <h1 className='selected-domain-name'>Selected Domain: {name}</h1>
    <form>
        <label className="enter-subdomain-label" htmlFor="subdomain-input">Mint Subdomain:</label>
        <div className="input-subdomain-container">
          <p className="absolute-ending-right">.{name}</p>
          <input
            className="subdomain-input"
            type="text"
            id="subdomain-input"
            value={subdomain}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSubdomain(e.target.value)}
          />
        </div>
        {loading && (
          <>
            <div className="loading-spinner">
              <FaSpinner className="spinner" />
            </div>
          </>
        )}
        {mintPage && (
          <div className="mint-success-container">
          <h1 className="mint-success">You successfully minted {subdomain}.{name}</h1>
          </div>
        )}
      </form>
  </div>
  );
}
