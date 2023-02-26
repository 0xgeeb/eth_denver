import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import constants from "./constants/constants";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "whiycWcW9NS-2DF3nBWhi4fogmFkJDcQ",
  network: Network.ETH_GOERLI
}

const alchemy = new Alchemy(settings)

export const injected = new InjectedConnector();
const ENS_ABI = constants.abi.goerli;
const ENS_ADDRESS = constants.address.goerli;

function App() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [ownedEns, setOwnedEns] = useState([])

  const {
    active,
    activate,
    chainId,
    account,
    library: provider,
  } = useWeb3React();

  useEffect(() => {
    async function fetchEnsNames() {
      if(active) {
        const nftsForOwner = await alchemy.nft.getNftsForOwner(account)
        console.log(nftsForOwner.ownedNfts)
        const ensArray = []
        for(let i = 0; i < nftsForOwner.ownedNfts.length; i++) {
          if(nftsForOwner.ownedNfts[i].contract.address.toLowerCase() === ENS_ADDRESS.toLowerCase()) {
            const split = nftsForOwner.ownedNfts[i].description.split(",")
            console.log(split[0])
            ensArray.push(split[0])
          }
        }
        setOwnedEns(ensArray)
      }
    }

    fetchEnsNames()
  }, [active])

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
      <div>
        {
          ownedEns && ownedEns.map((ens) => {
            return <p>{ens}</p>
          })
        }
      </div>
    </div>
  );
}

export default App;
