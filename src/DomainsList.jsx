import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import constants from "./constants/constants";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Network, Alchemy } from "alchemy-sdk";
import convertToParentNode from "./utils/utils";
import SelectedDomain from "./SelectedDomain";


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
                const split = nftsForOwner.ownedNfts[i].description.split(",");
                ensArray.push(split[0]);
              }
            }
            setOwnedEns(ensArray);
          }
        }
    
        fetchEnsNames();
      }, [web3.active]);

      useEffect(() => {console.log(selectedEns);},[])

    async function handleSelectEns(e) {
        setSelectedEns(e.target.value);
        setIsEnsSelected(true);
        setSelectedDomain(e.target.value);
        setOwnedEns([e.target.value]);
      }
  
      return (
        <div className="domains-list-container">
          {isEnsSelected ? (
            <div>
              <button onClick={() => setIsEnsSelected(false)}>Back to Domains</button>
              <SelectedDomain name={selectedDomain} />
            </div>
          ) : (
            <div>
              <h1 className="domains-list-header">Select a Domain</h1>
              {ownedEns && (
                <form>
                  <div className="ens-domains-container">
                    {ownedEns.map((ens) => {
                      return (
                        <div key={ens}>
                          <input
                            type="radio"
                            id={ens}
                            name="ens_option"
                            value={ens}
                            className="domains-list-button"
                            onClick={(e) => handleSelectEns(e)}
                          />
                          <label className="domains-list-button" htmlFor={ens}>
                            {ens}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      );
  }
  
  export default DomainsList;
  
