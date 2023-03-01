import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import constants from "./constants/constants";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Network, Alchemy } from "alchemy-sdk";
import { namehash, normalize } from "./ens-package";
import uts46 from "idna-uts46-hx";

const settings = {
  apiKey: "3yeNGQ-JU51M9TPzks7BjCqlaBkiC1ey",
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

export const injected = new InjectedConnector();
const ENS_ABI_MAIN = constants.abiMain.goerli;
const ENS_ADDRESS = constants.addressMain.goerli;
const NAME_WRAPPER_ADDRESS = constants.addressNameWrapper.goerli;
const NAME_WRAPPER_ABI = constants.abiNameWraper.goerli;

function Subdomains() {
  
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
    console.log(namehash);
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
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      NAME_WRAPPER_ADDRESS,
      NAME_WRAPPER_ABI,
      signer
    );
    console.log("hiiiiii");
    let hashValue = namehash(selectedEns);
    console.log("yooooooo");
    let label = typedSubdomain;
    let owner = signer;
    let fuses = 0;
    let expiry = Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60;
    try {
      await contract.setSubnodeOwner(hashValue, label, owner, fuses, expiry);
      console.log("success");
    } catch (error) {
      console.log(error);
      console.log("fail");
    }
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

export default Subdomains;