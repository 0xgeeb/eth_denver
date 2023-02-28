import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import constants from "./constants/constants";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "3yeNGQ-JU51M9TPzks7BjCqlaBkiC1ey",
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

export const injected = new InjectedConnector();
const ENS_ABI = constants.abi.goerli;
const ENS_ADDRESS = constants.address.goerli;

function App() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [ownedEns, setOwnedEns] = useState(null);
  const [selectedEns, setSelectedEns] = useState(null);
  const [typedSubdomain, setTypedSubdomain] = useState("");
  const [isEnsSelected, setIsEnsSelected] = useState(false);
  const [mintingPage, setMintingPage] = useState(false);

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
        console.log(nftsForOwner.ownedNfts);
        const ensArray = [];
        for (let i = 0; i < nftsForOwner.ownedNfts.length; i++) {
          if (
            nftsForOwner.ownedNfts[i].contract.address.toLowerCase() ===
            ENS_ADDRESS.toLowerCase()
          ) {
            const split = nftsForOwner.ownedNfts[i].description.split(",");
            console.log(split[0]);
            ensArray.push(split[0]);
          }
        }
        setOwnedEns(ensArray);
      }
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

  async function handleSelectEns(e) {
    setSelectedEns(e.target.value);
    setIsEnsSelected(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMintingPage(true);
  }

  return (
    <div className="app">
      <div className="header">
        <h1>ens subdomain infra</h1>
        <div className="account-info-div">
          {account}
          <button className="header-button" onClick={connectWallet}>
            {hasMetamask ? "connected" : "connect wallet"}
          </button>
        </div>
      </div>
      <div className="choose-doteth-section">
        {isEnsSelected && mintingPage ? (
          <div>
            <p>minting</p>
            <p>
              {typedSubdomain}.{selectedEns}
            </p>
          </div>
        ) : isEnsSelected && !mintingPage ? (
          <div>
            <p>type subdomain</p>
            <form>
              <input
                type="text"
                value={typedSubdomain}
                onChange={(e) => setTypedSubdomain(e.target.value)}
              />
              <input
                type="submit"
                style={{ display: "none" }}
                onClick={(e) => handleSubmit(e)}
              />
            </form>
            <p>{`${typedSubdomain}.${selectedEns}`}</p>
          </div>
        ) : (
          ownedEns && (
            <>
              <p>choose .eth</p>
              <form>
                <div className="ens-container">
                  {ownedEns.map((ens) => {
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
                </div>
              </form>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default App;
