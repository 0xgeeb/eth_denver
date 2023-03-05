import React, {useState} from 'react'
import { ethers } from "ethers"
import constants from "./constants/constants";
import ExploreDomainsRight from "./ExploreDomainsRight";

export default function ExploreDomains({ web3 }) {
  const [isEnsSelected, setIsEnsSelected] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedEns, setSelectedEns] = useState(null);
  
  const textEncoder = new TextEncoder();

  const domainArray = ["fruit.eth", "pain.eth", "goerlienswhale.eth"]

  async function handleSelectEns(e) {
    e.preventDefault();
    setSelectedEns(e.target.value);
    setIsEnsSelected(true);
    setSelectedDomain(e.target.value);
    }


  return (
    <div className='domains-list-container'>
      {isEnsSelected ? (
            <div>
              <button onClick={() => setIsEnsSelected(false)} className="back-to-domains-button">Back To Explore List</button>
              <ExploreDomainsRight web3={web3} name={selectedDomain} />
            </div>
          ) : (
            <div>
              <h1 className="domains-list-header">Explore Domains</h1>
              {domainArray && (
                <form>
                  <div className="ens-domains-container">
                    {domainArray.map((ens) => {
                      return (
                        <div className="domains-name-container" key={ens}>
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