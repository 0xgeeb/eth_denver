import { useState, useEffect } from "react";
import "./App.css";
import constants from "./constants/constants";
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
    apiKey: "3yeNGQ-JU51M9TPzks7BjCqlaBkiC1ey",
    network: Network.ETH_GOERLI,
  };
  
const alchemy = new Alchemy(settings);

const ENS_ADDRESS = constants.address.base;

export default function SelectedDomain({ web3, name }) {
    const [ownedEns, setOwnedEns] = useState(null);




  return (
    <div className='selected-domain-container'>
  <h1 className='selected-domain-name'>selected domain: {name}</h1>
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
  </div>);
}
