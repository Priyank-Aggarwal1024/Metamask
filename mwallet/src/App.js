import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import RecoverAccount from "./components/RecoverAccount";
import WalletView from "./components/WalletView";
import SignInPwd from "./components/signInPwd";
import logo from "./images/wallet.png"
import Initial from "./components/Initial"
import RecoverAccountSeed from "./components/seedPhrase";
import Enterpass from "./components/Enterpass";
import WatchWallet from "./components/wachWallet";



function App() {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [selectedChain, setSelectedChain] = useState("devnet");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");





  return (
    <>

      <div className="header relative max-w-[350px] p-0 m-0">
        <header className="relative z-[4] p-4 flex items-center justify-between text-white">
          <img src={logo} className="h-10 w-auto" alt="logo" />
          <select
            onChange={(e) => setSelectedChain(e.target.value)}
            value={selectedChain}
            className="dropdown text-white border border-black rounded-lg p-2"
          >
            <option value="mainnet">Mainnet</option>
            <option value="devnet">Devnet</option>
          </select>
        </header>
      </div>



      <div className="App">
        {wallet && seedPhrase ? (
          <Routes>
            <Route
              path="/yourwallet"
              element={
                <WalletView
                  wallet={wallet}
                  setWallet={setWallet}
                  seedPhrase={seedPhrase}
                  setSeedPhrase={setSeedPhrase}
                  selectedChain={selectedChain}
                  password={password}
                />
              }
            />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Initial />} />
            <Route path="/enterpass" element={<Enterpass
            />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/recover"
              element={
                <RecoverAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                  password={password}
                  setPassword={setPassword}

                />
              }
            />
            <Route
              path="/yourwallet"
              element={
                <Enterpass
                  password={password}
                  setPassword={setPassword}
                  confirmpassword={confirmpassword}
                  setConfirmPassword={setConfirmPassword}
                />
              }
            />
            <Route
              path="/confirmwallet"
              element={
                <CreateAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                  password={password}
                  setPassword={setPassword}
                />
              }
            />
            <Route
              path="/signin"
              element={
                <SignInPwd
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                  setPassword={setPassword}
                />
              }
            />
            <Route
              path="/recoverseed"
              element={
                <RecoverAccountSeed
                  setPassword={setPassword}
                  password={password}
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                />
              }
            />
            <Route
              path="/watch-wallet"
              element={
                <WatchWallet
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                  setPassword={setPassword}
                />
              }
            />
          </Routes>
        )}
      </div>
    </>
  );
}

export default App;
