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

const textEncoder = new TextEncoder();
export const injected = new InjectedConnector();
const ENS_ABI_MAIN = constants.abi.base;
const ENS_ADDRESS = constants.address.base;
const NAME_WRAPPER_ADDRESS = constants.address.nameWrapper;
const NAME_WRAPPER_ABI = constants.abi.nameWrapper;
const RESOLVER_ADDRESS = constants.address.resolver;
const REGISTRY_ABI = constants.abi.registryWithFallback;
const REGISTRY_ADDRESS = constants.address.registryWithFallback;

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
      REGISTRY_ADDRESS,
      REGISTRY_ABI,
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
    const subdomainHash = ethers.utils.keccak256(
      textEncoder.encode(typedSubdomain)
    );
    console.log(typedSubdomain)
    console.log(parentNode)
    console.log(subdomainHash)
    try {
      await contract.setSubnodeRecord(parentNode, subdomainHash, account, RESOLVER_ADDRESS, 0);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>ens subdomain infra</h1>
        <div className="account-info-div">
          <a href="/subdomains"><button className="header-button">subdomains</button></a>
          <a href="/domains"><button className="header-button">domains</button></a>
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
              <p>choose .eth to mint a subdomain on</p>
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
