import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import constants from "./constants/constants";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Network, Alchemy } from "alchemy-sdk";
import convertToParentNode from "./utils/utils";
import SelectedDomainLeft from "./SelectedDomainLeft";
import ExploreDomains from "./ExploreDomains";


  const settings = {
    apiKey: "3yeNGQ-JU51M9TPzks7BjCqlaBkiC1ey",
    network: Network.ETH_GOERLI,
  };
  
  const alchemy = new Alchemy(settings);
  
  const textEncoder = new TextEncoder();
  const ENS_ABI_MAIN = constants.abi.base;
  const ENS_ADDRESS = constants.address.base;
  const NAME_WRAPPER_ADDRESS = constants.address.nameWrapper;
  const NAME_WRAPPER_ABI = constants.abi.nameWrapper;
  const REGISTRY_ABI = constants.abi.registryWithFallback;
  const REGISTRY_ADDRESS = constants.address.registryWithFallback;

  function DomainsList({ web3 }) {
    const [ownedEns, setOwnedEns] = useState(null);
    const [selectedEns, setSelectedEns] = useState(null);
    const [isEnsSelected, setIsEnsSelected] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(null);
    
    useEffect(() => {
        async function fetchEnsNames() {
          if (web3.active) {
            const nftsForOwner = await alchemy.nft.getNftsForOwner(web3.account);
            const ensArray = [];
            for (let i = 0; i < nftsForOwner.ownedNfts.length; i++) {
              if (
                nftsForOwner.ownedNfts[i].contract.address.toLowerCase() ===
                ENS_ADDRESS.toLowerCase()
              ) {
                const tokenId = nftsForOwner.ownedNfts[i].tokenId
                const name = nftsForOwner.ownedNfts[i].title
                ensArray.push({name, tokenId})
              }
            }
            let ownsEns
            ensArray.length > 0 ? ownsEns = true : ownsEns = false
            setOwnedEns({ensArray, ownsEns});
          }
        }
    
        fetchEnsNames();
      }, [web3.active]);

    async function handleSelectEns(e) {
      e.preventDefault();
      setSelectedEns(e.target.value);
      setIsEnsSelected(true);
      setSelectedDomain(e.target.value);
    }

      return (
        <div className="domains-list-container">
          {isEnsSelected ? (
            <div>
              <button onClick={() => setIsEnsSelected(false)} className="back-to-domains-button">Back To Domains List</button>
              <hr />
              <SelectedDomainLeft web3={web3} name={selectedDomain} ensObject={ownedEns.ensArray} />
            </div>
          ) : (
            <div>
              <h1 className="domains-list-header">Select a Domain You Own</h1>
              {ownedEns && (
                <form>
                  <div className="ens-domains-container">
                    {ownedEns.ownsEns ? ownedEns.ensArray.map((ens) => {
                      return (
                        <div className="domains-name-container" key={ens.name}>
                        <input
                          type="radio"
                          id={ens.name}
                          name="ens_option"
                          value={ens.name}
                          className="domains-list-button"
                          onClick={(e) => handleSelectEns(e)}
                        />
                        <label className="domains-list-button" htmlFor={ens.name}>
                          {ens.name}
                        </label>
                        </div>
                      );
                    }) : (<p className="domains-list-no-ens">You don't own any ENS Domains go to <a target="_blank" className="ens-domains-link" href="https://ens.domains/">ens.domains</a> to mint one</p>)}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      );
  }
  
  export default DomainsList;
  
