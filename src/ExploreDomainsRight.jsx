import { useState, useEffect } from "react";
import "./App.css";
import constants from "./constants/constants";
import {ethers} from "ethers";

const textEncoder = new TextEncoder();
const RESOLVER_ADDRESS = constants.address.resolver;
const REGISTRY_ABI = constants.abi.registryWithFallback;
const REGISTRY_ADDRESS = constants.address.registryWithFallback;
const MANAGER_ADDRESS = constants.address.manager;
const MANAGER_ABI = constants.abi.manager;


export default function ExploreDomainsRight({ web3, name, tokenId }) {
  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [mintPage, setMintPage] = useState(false);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [sendToExplorePage, setSendToExplorePage] = useState(false);

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
    await contract.mintSubdomain(parentNode, subdomain)
    setLoading(false);
    setMintPage(true);
  }

  async function handleWithdrawFromExploreContract(e) {
    e.preventDefault();
    setLoadingExplore(true);
    const signer = web3.library.getSigner();
    const managerContract = new ethers.Contract(
      MANAGER_ADDRESS,
      MANAGER_ABI,
      signer
    );
    try {
      const tx = await managerContract.withdrawENS(tokenId)
      tx.wait()
    } catch (e) {
      console.log(e);
    }
    setLoadingExplore(false);
    setSendToExplorePage(true);
  }

  return (
  <div className='selected-domain-container'>
    <h1 className='selected-domain-name'>Selected Domain: {name}</h1>
    <form>
      <div className="label-input-container">
        <label className="enter-subdomain-label" htmlFor="subdomain-input" onClick={(e) => handleSubmit(e)}>Mint Subdomain:</label>
        <div className="input-subdomain-container">
          <input
            className="subdomain-input"
            type="text"
            id="subdomain-input"
            placeholder={`_______.${name}`}
            value={subdomain}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSubdomain(e.target.value)}
          />
        </div>
      </div>
        {loading && (
          <div className="loading-spinner">
            <span className="spinner" style={{display: 'inherit'}}>
              <span style={{display: 'inline-block', backgroundColor: 'white', width: '30px', height: '30px', margin: '2px', borderRadius: '100%', animation: '0.7s linear 0s infinite normal both running react-spinners-BeatLoader-beat'}}></span>
              <span style={{display: 'inline-block', backgroundColor: 'white', width: '30px', height: '30px', margin: '2px', borderRadius: '100%', animation: '0.7s linear 0.35s infinite normal both running react-spinners-BeatLoader-beat'}}></span>
              <span style={{display: 'inline-block', backgroundColor: 'white', width: '30px', height: '30px', margin: '2px', borderRadius: '100%', animation: '0.7s linear 0s infinite normal both running react-spinners-BeatLoader-beat'}}></span>
            </span>
          </div>
        )}
        {mintPage && (
          <div className="mint-success-container">
          <h1 className="mint-success">You successfully minted {subdomain}.{name}</h1>
          </div>
        )}
      </form>
      <button onClick={(e) => handleWithdrawFromExploreContract(e)} className="send-to-explore-contract-button">Withdraw {name} from Explore Domains Contract if Owner</button>
      {loadingExplore && (
        <div className="loading-spinner">
          <span className="spinner" style={{display: 'inherit'}}>
            <span style={{display: 'inline-block', backgroundColor: 'white', width: '30px', height: '30px', margin: '2px', borderRadius: '100%', animation: '0.7s linear 0s infinite normal both running react-spinners-BeatLoader-beat'}}></span>
            <span style={{display: 'inline-block', backgroundColor: 'white', width: '30px', height: '30px', margin: '2px', borderRadius: '100%', animation: '0.7s linear 0.35s infinite normal both running react-spinners-BeatLoader-beat'}}></span>
            <span style={{display: 'inline-block', backgroundColor: 'white', width: '30px', height: '30px', margin: '2px', borderRadius: '100%', animation: '0.7s linear 0s infinite normal both running react-spinners-BeatLoader-beat'}}></span>
          </span>
        </div>
        )}
      {sendToExplorePage && (
        <div className="mint-success-container">
          <h1 className="mint-success">You successfully withdrew {name} from the explore contract</h1>
        </div>
        )}
  </div>
  );
}
