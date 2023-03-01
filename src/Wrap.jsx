import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import constants from "./constants/constants";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Network, Alchemy } from "alchemy-sdk";
import convertToParentNode from "./utils/utils";


const settings = {
    apiKey: "3yeNGQ-JU51M9TPzks7BjCqlaBkiC1ey",
    network: Network.ETH_GOERLI,
  };
  
  const alchemy = new Alchemy(settings);
  
  const textEncoder = new TextEncoder();
  export const injected = new InjectedConnector();
  const ENS_ABI_MAIN = constants.abi.base;
  const ENS_ADDRESS = constants.address.base;
  const NAME_WRAPPER_ADDRESS = constants.address.nameWrapper;
  const NAME_WRAPPER_ABI = constants.abi.nameWrapper;

  function Wrap() {
    const [hasMetamask, setHasMetamask] = useState(false);
    const [ownedEns, setOwnedEns] = useState(null);
    const [selectedEns, setSelectedEns] = useState(null);
    const [isEnsSelected, setIsEnsSelected] = useState(false);
    const [wrappedNames, setWrappedNames] = useState(null);
    const [unwrappedNames, setUnwrappedNames] = useState(null);
  
    const {
      active,
      activate,
      chainId,
      account,
      library: provider,
    } = useWeb3React();
  
   useEffect(() => {
      async function fetchEnsNames() {
        if (active) {
          const nftsForOwner = await alchemy.nft.getNftsForOwner(account);
          console.log(nftsForOwner);
          const wrappedEnsArray = [];
          const unwrappedEnsArray = [];
          for (let i = 0; i < nftsForOwner.ownedNfts.length; i++) {
            if (
              nftsForOwner.ownedNfts[i].contract.address.toLowerCase() ===
              ENS_ADDRESS.toLowerCase()
            ) {
              const split = nftsForOwner.ownedNfts[i].description.split(",");
              unwrappedEnsArray.push(split[0]);
            }
          }
          const contract = new ethers.Contract(
            NAME_WRAPPER_ADDRESS,
            NAME_WRAPPER_ABI
          );
          }
            setWrappedNames(wrappedEnsArray);
            setUnwrappedNames(unwrappedEnsArray);
        }
      
      
      fetchEnsNames();
    }, [active]);

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

    useEffect(() => {
        const tokenId = ethers.utils.keccak256(textEncoder.encode("soup"));
        console.log(tokenId)
        const bigNumberId = ethers.BigNumber.from(tokenId);
    })
  
    async function handleSelectEns(e) {
      setSelectedEns(e.target.value);
      setIsEnsSelected(true);
      const label = (e.target.value).split(".")[0];
      const signer = provider.getSigner();
      const contractRegistrar = new ethers.Contract(
        ENS_ADDRESS,
        ENS_ABI_MAIN,
        signer
      );
      const tokenId = ethers.utils.keccak256(textEncoder.encode(label));
      console.log(tokenId)
      const bigNumberId = ethers.BigNumber.from(tokenId);
     const tx = await contractRegistrar.approve(NAME_WRAPPER_ADDRESS, bigNumberId);
     await tx.wait();
      const contractWrapper = new ethers.Contract(
        NAME_WRAPPER_ADDRESS,
        NAME_WRAPPER_ABI,
        signer
      );
     const tx2 = await contractWrapper.wrapETH2LD(label, account, 0, "0x19c2d5D0f035563344dBB7bE5fD09c8dad62b001");
      await tx.wait();
    }
  
    async function handleSubmit(e) {
      e.preventDefault();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NAME_WRAPPER_ADDRESS,
        NAME_WRAPPER_ABI,
        signer
      );
      const x0 = 0;
      const x1 = ethers.utils.keccak256(textEncoder.encode("eth"));
      const eth = ethers.utils.solidityKeccak256(
        ["uint256", "bytes32"],
        [x0, x1]
      );
      const labelHash = ethers.utils.keccak256(
        textEncoder.encode(selectedEns.split(".")[0])
      );
      const parentNode = ethers.utils.solidityKeccak256(
        ["bytes32", "bytes32"],
        [eth, labelHash]
      );
    }
  
    return (
      <div className="app">
        <div className="header">
          <h1>ens subdomain infra</h1>
          <div className="account-info-div">
          <a href="/register"><button className="header-button">register</button></a>
            {account}
            <button className="header-button" onClick={connectWallet}>
              {hasMetamask ? "connected" : "connect wallet"}
            </button>
          </div>
        </div>
        {!isEnsSelected &&
        <div className="choose-doteth-section">
          {(wrappedNames || unwrappedNames) && (
              <>
                <p>choose .eth to wrap</p>
                <form>
                  <div className="ens-container">
                  {unwrappedNames.length == 0 && <h5>N/A</h5>}
                    {unwrappedNames.map((ens) => {
                      return (
                        <div key={ens}>
                          <input
                            type="radio"
                            id={ens}
                            name="ens_option"
                            value={ens}
                            className="radio-button"
                            onChange={(e) => handleSelectEns(e)}
                          />
                          <label htmlFor={ens}>{ens}</label>
                        </div>
                      );
                    })}
                    <p>already wrapped</p>
                    {wrappedNames.length == 0 && <h5>N/A</h5>}
                     {wrappedNames.map((ens) => {
                      return (
                        <div key={ens}>
                          <input
                            type="radio"
                            id={ens}
                            name="ens_option"
                            value={ens}
                            className="radio-button"
                            disabled
                            onChange={(e) => handleSelectEns(e)}
                          />
                          <label htmlFor={ens}>{ens}</label>
                        </div>
                      );
                    })}
                  </div>
                </form>
              </>
            )
            }
        </div>}
      </div>
    );
  }
  
  export default Wrap;
  
