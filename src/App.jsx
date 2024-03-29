import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core"
import NewDomains from "./NewDomains.jsx"
import Domains from "./Domains.jsx"
import Subdomains from "./Subdomains.jsx"
import DomainsList from "./DomainsList.jsx"
import MainPage from "./MainPage.jsx";
import HomePage from "./HomePage.jsx";
import logo from "./images/logo.png"

export default function App() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  let acc = localStorage.getItem("account")

  const injected = new InjectedConnector();
  const web3 = useWeb3React();

  async function connectOnLoad() {
    setIsLoading(true)
    setTimeout(() => {
      try {
        web3.activate(injected)
        setWalletConnected(true)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
      }
    }, 1000)
  }

  useEffect(() => {
    if(acc != null) {
      connectOnLoad()
    }
  }, [])

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await web3.activate(injected);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        acc = localStorage.setItem("account", accounts[0])
        setWalletConnected(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Please download metamask");
    }
  }

  async function disconnectWallet() {
    console.log('disconnecting')
    try {
      web3.deactivate()
      localStorage.removeItem("account")
    } catch (e) {
      console.log(e)
    }
  }

  function renderButton() {
    if(walletConnected) {
      return "connected"
    }
    else {
      if(isLoading) {
        return "   ...   "
      }
      else {
        return "connect wallet"
      }
    }
  }

  function clickButton() {
    if(walletConnected) {
      disconnectWallet()
    }
    else {
      connectWallet()
    }
  }

  return (
    <Router>
      <div className="app">
        <div className="header">
          <a href="/" className="header-title-anchor">
            <h1 className="header-title">New Dot Eth</h1>
            <img className="header-logo" src={logo} alt="logo" height="40" width="40"  />
          </a>
          <div className="account-info-div">
            <button className="header-button-connect" onClick={() => clickButton()}>
              {renderButton()}
            </button>
          </div>
        </div>
        <div className="bg-animation">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
          <div id="stars4"></div>
        </div>
        <Routes>
          <Route path="/" element={<HomePage web3={web3} />} />
          <Route path="/domains" element={<MainPage web3={web3} />} />
        </Routes>
      </div>
    </Router>
  )
}