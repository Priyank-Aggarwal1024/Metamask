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
import setting from './images/setting.svg'
import scan2 from './images/scan2.svg'
import security2 from './images/security2.svg'
import key4 from './images/key4.svg'


function App() {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [selectedChain, setSelectedChain] = useState("devnet");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");



  const [openModal, setOpenModal] = useState(false)

  return (
    <>

      <div className="header relative max-w-[350px] p-0 m-0">
        {
          openModal && <div className="absolute z-[5] w-full bg-[#ffffff33] h-[780px]"></div>
        }
        <header className="relative z-[6] p-4 flex items-center justify-between text-white">
          <img src={logo} className="h-10 w-auto" alt="logo" />
          <div className="pr-2 relative">
            <img src={setting} className="" alt="Network Modal" onClick={() => setOpenModal(!openModal)} />
            {
              openModal && <>
                <div className="w-[208px] h-[236px] bg-[#080808] rounded-[10px] absolute top-[150%] right-0 z-[10]">
                  <div className="w-full px-2 py-2.5">
                    <div className="flex flex-col w-full bg-[#161616] rounded-[10px]">

                      <div className="w-full p-2 flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setSelectedChain("mainnet")
                          setOpenModal(false)
                        }}
                      >
                        <p className={`font-urbanist text-[13px] font-[500] ${selectedChain === "mainnet" ? "text-[#9945FF]" : "text-[#fff]"}`}>Switch to Mainnet</p>
                        {
                          selectedChain === "mainnet" && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3.75 10.5L6.375 13.125L14.25 4.875" stroke="#9945FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        }
                      </div>
                      <div className="w-full h-[1px] bg-[#2A2A2A]"></div>
                      <div className="w-full p-2 flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setSelectedChain("devnet")
                          setOpenModal(false)
                        }}
                      >
                        <p className={`font-urbanist text-[13px] font-[500] ${selectedChain === "devnet" ? "text-[#9945FF]" : "text-[#fff]"}`}>Switch to Devnet</p>
                        {
                          selectedChain === "devnet" && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3.75 10.5L6.375 13.125L14.25 4.875" stroke="#9945FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        }
                      </div>

                    </div>
                  </div>
                  <div className="my-[3px] h-[1px] bg-[#1D1D1D] w-full"></div>
                  <div className="px-2 pb-4 pt-2.5 w-full flex flex-col gap-4">
                    <div className="text-[#474747] text-[13px] font-medium font-['Urbanist']">Security</div>
                    <div className="flex items-center">
                      <img src={scan2} alt="Scan" />
                      <div className="text-white text-xs font-medium font-['Urbanist'] pl-[5px]">Generate 2FA QR code</div>
                    </div>
                    <div className="flex items-center">
                      <img src={security2} alt="Security" />
                      <div className="text-white text-xs font-medium font-['Urbanist'] pl-[5px]">Setup transaction pin</div>
                    </div>
                    <div className="flex items-center">
                      <img src={key4} alt="Key" />
                      <div className="text-white text-xs font-medium font-['Urbanist'] pl-[5px]">Reveal private Key</div>
                    </div>
                  </div>
                </div>
              </>
            }
          </div>
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
