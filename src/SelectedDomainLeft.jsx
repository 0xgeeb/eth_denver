import { useState } from "react";
import "./App.css";
import constants from "./constants/constants";
import {ethers} from "ethers";
import convertToParentNode from "./utils/utils";

const textEncoder = new TextEncoder();
const RESOLVER_ADDRESS = constants.address.resolver;
const REGISTRY_ABI = constants.abi.registryWithFallback;
const REGISTRY_ADDRESS = constants.address.registryWithFallback;
const MANAGER_ADDRESS = constants.address.manager;
const MANAGER_ABI = constants.abi.manager;
const NAME_WRAPPER_ADDRESS = constants.address.nameWrapper;
const NAME_WRAPPER_ABI = constants.abi.nameWrapper;
const ENS_ABI_MAIN = constants.abi.base;
const ENS_ADDRESS = constants.address.base;


export default function SelectedDomain({ web3, name, ensObject }) {
  const [subdomain, setSubdomain] = useState("");
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [mintPage, setMintPage] = useState(false);
  const [sendToExplorePage, setSendToExplorePage] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      handleSubmit(event)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoadingSub(true);
    const signer = web3.library.getSigner();
    const contract = new ethers.Contract(
      REGISTRY_ADDRESS,
      REGISTRY_ABI,
      signer
    );
    const parentNode = convertToParentNode(name.split(".")[0])
    const subdomainHash = ethers.utils.keccak256(
      textEncoder.encode(subdomain)
    );
    try {
       const tx = await contract.setSubnodeRecord(parentNode, subdomainHash, web3.account, RESOLVER_ADDRESS, 0);
       await tx.wait()
     } catch (e) {
       console.log(e);
     }
     setLoadingSub(false);
     setMintPage(true);
  }

  function updateProgress(value) {
    setProgress((prevProgress) => prevProgress + value);
  }

  async function handleSendToExploreContract(e) {
    e.preventDefault();
    setLoadingExplore(true);
    const signer = web3.library.getSigner();
    const address = await signer.getAddress();
    let tokenId;
    console.log(tokenId);
    const label = name.split(".")[0]
    for (let i = 0; i < ensObject.length; i++) {
      if (ensObject[i].name === name) {
         tokenId = ensObject[i].tokenId;
      }
    }
    const contractRegistrar = new ethers.Contract(
      ENS_ADDRESS,
      ENS_ABI_MAIN,
      signer
    );
    try {
      const tx = await contractRegistrar.approve(NAME_WRAPPER_ADDRESS, tokenId);
      await tx.wait();
      updateProgress(1); 
    } catch (e) {
      console.log(e);
    }
    const nameWrapperContract = new ethers.Contract(
      NAME_WRAPPER_ADDRESS,
      NAME_WRAPPER_ABI,
      signer
    )
    let newTokenId;
    const promise = new Promise((resolve) => {
      nameWrapperContract.on("TransferSingle", (index_topic_1, from, to, id, value, event) => {
        newTokenId = id;
        resolve(newTokenId);
      });
    });
    try {
      const tx2 = await nameWrapperContract.wrapETH2LD(label,address,0, RESOLVER_ADDRESS)
      await tx2.wait()
      updateProgress(1); 
    } catch (e) {
      console.log(e);
    }
    const tokenID = await promise;
    let isManagerContractApproved
    try {
      isManagerContractApproved = await nameWrapperContract.isApprovedForAll(address, MANAGER_ADDRESS);
    } catch (e) {
      console.log(e);
    }
    if (!isManagerContractApproved) {
      try {
        const tx3 = await nameWrapperContract.setApprovalForAll(MANAGER_ADDRESS, true);
        updateProgress(1); 
        await tx3.wait();
      } catch (e) {
        console.log(e);
      }
    }
    const managerContract = new ethers.Contract(
      MANAGER_ADDRESS,
      MANAGER_ABI,
      signer
    );
    try {
      const tx4 = await managerContract.depositENS(tokenID, name)
      updateProgress(1); 
      await tx4.wait();   
      updateProgress(1); 
      await new Promise((resolve) => setTimeout(resolve, 2000)); 

    } catch (e) {
      console.log(e);
    }
    setLoadingExplore(false);
    console.log(loadingExplore);
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
            value={subdomain}
            placeholder={`_______.${name}`}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSubdomain(e.target.value)}
          />
        </div>
      </div>
        {loadingSub && (
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
      <h2 className='selected-domain-or'>or</h2>
      <button onClick={(e) => handleSendToExploreContract(e)} className="send-to-explore-contract-button">Wrap & Send {name} to Explore Domains Contract</button>
      {loadingExplore && (
        <>
          <h1 className="wrap-send-header">Wrap & Send Progress</h1>
          <div className="loading-bar">
            <div className={`loading-bar-section${progress >= 1 ? ' loading' : ''}`}>Approve Namewrapper</div>
            <div className={`loading-bar-section${progress >= 2 ? ' loading' : ''}`}>Wrap Name</div>
            <div className={`loading-bar-section${progress >= 3 ? ' loading' : ''}`}>Approve Explore Contract</div>
            <div className={`loading-bar-section${progress >= 4 ? ' loading' : ''}`}>Deposit Name</div>
          </div>
        </>
)}
      {sendToExplorePage && (
        <div className="mint-success-container">
          <h1 className="mint-success">You successfully sent {name} to the explore contract, refresh to see it on the explore side</h1>
        </div>
        )}
  </div>
  );
}