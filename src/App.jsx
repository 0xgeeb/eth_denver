import React, { useState } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core"
import Subdomains from "./Subdomains.jsx"
import Domains from "./Domains.jsx"
import Wrap from "./Wrap.jsx"

export default function App() {

  const [hasMetamask, setHasMetamask] = useState(false);

  const injected = new InjectedConnector();
  const web3 = useWeb3React();

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await web3.activate(injected);
        setHasMetamask(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Please download metamask");
    }
  }

  return (
    <Router>
      <div className="app">
        <div className="header">
          <h1>ens subdomain infra</h1>
          <div className="account-info-div">
            <button onClick={() => console.log(web3)} className="header-button">test</button>
            <a href="/subdomains"><button className="header-button">subdomains</button></a>
            <a href="/domains"><button className="header-button">domains</button></a>
            {web3.account}
            <button className="header-button" onClick={connectWallet}>
              {hasMetamask ? "connected" : "connect wallet"}
            </button>
          </div>
        </div>
        <Routes>
          <Route path="/subdomains" element={<Subdomains web3={web3} />} />
          <Route path="/domains" element={<Domains web3={web3} />} />
          <Route path="/wrap" element={<Wrap />} />
        </Routes>
      </div>
    </Router>
  )
}