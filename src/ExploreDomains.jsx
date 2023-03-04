import React from 'react'
import { Network, Alchemy } from "alchemy-sdk";
import constants from "./constants/constants";

export default function ExploreDomains() {

  const settings = {
    apiKey: "3yeNGQ-JU51M9TPzks7BjCqlaBkiC1ey",
    network: Network.ETH_GOERLI,
  };
  
  const alchemy = new Alchemy(settings);

  async function handleClick() {
    const nftsForOwner = await alchemy.nft.getNftsForOwner(constants.address.manager)
    console.log(nftsForOwner)
  }

  return (
    <div className='Explore-Domains-Container'>
      <h1>explore domains</h1>
      <button onClick={() => handleClick()}>hello</button>
    </div>
  )
}
