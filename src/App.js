import { useState } from "react"
import './App.css';


function App() {

  const [currentAccount, setCurrentAccount] = useState("")

  async function connectWallet() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    setCurrentAccount(account)
  }

  return (
    <div className="app">
      <div className="header">
        <h1>ens subdomain infra</h1>
        <button className="header-button" onClick={connectWallet}>{currentAccount ? "connected" : "connect wallet"}</button>
      </div>
      <p className="address-div">{currentAccount ? currentAccount : ""}</p>
    </div>
  )
}

export default App;
