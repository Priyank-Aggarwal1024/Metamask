import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Button, List, Spin } from "antd";
import { ArrowLeftOutlined, CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { Keypair } from "@solana/web3.js";
import axios from "axios";
import WalletHeader from "./WalletHeader";
import AssetsTab from "./AssetsTab";
import SendTab from "./SendTab";
import SecurityTab from "./SecurityTab";
import SwapTab from "./SwapTab";
import send from "../images/send.svg";
import swap from "../images/swap.svg";
import swap3 from "../images/swap3.svg";
import fillswap from "../images/fillswap.svg";
import recieve from "../images/recieve.svg"
import asset from '../images/asset.svg'
import assetfill from '../images/assetfill.svg'
import transactionImg from '../images/transaction.svg'
import filltransactionImg from '../images/filltransaction.svg'
import bs58 from "bs58";
import TransactionHistory from "./TransactionHistory";
import ReceiveTab from "./ReceiveTab";
import BackArrow from "./BackArrow";
import setting from '../images/setting.svg'
import scan2 from '../images/scan2.svg'
import security2 from '../images/security2.svg'
import key4 from '../images/key4.svg'
import triangle from '../images/triangle.svg'
import sendb from '../images/sendb.svg'
import recieveb from '../images/recieveb.svg'

function WalletView({ wallet, setWallet, setSeedPhrase, selectedChain, password, account, authTab, setAuthTab, setSelectedChain }) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupdiv, setShowPopupdiv] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedAccountVal, setSelectedAccountVal] = useState({
    publicKey: wallet,
    usdbal: 0,
    privateKey: "",
  });
  const [accountkeys, setAccountKeys] = useState("[]");
  const [accountTokens, setAccountTokens] = useState(null);
  const [transactionData, setTransactionData] = useState("[]");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usd, setusd] = useState(0);
  const [tab, setTab] = useState(4)
  const [openModal, setOpenModal] = useState(false)

  const handleAccountSelection = (wallet) => {
    const selectedKey = accountkeys.find(key => key.publicKey === wallet);
    if (selectedKey) {
      setSelectedAccountVal({
        publicKey: selectedKey.publicKey,
        usdbal: selectedKey.usdbal,
        privateKey: selectedKey.secretKey,
      });
    }
  };
  const handleWalletDropDown = () => {
    if (showPopup) {
      closePopup()
    } else {
      handleImportClick();
    }
  }
  useEffect(() => {
    const fetchAndSetBalance = async () => {
      if (wallet) {
        const balance = await fetchBalance(wallet, selectedChain);
        setSelectedAccountVal(prevState => ({
          ...prevState,
          usdbal: balance,
        }));
      }
    };
    fetchAndSetBalance();
  }, [wallet, accountkeys, selectedChain]);



  async function fetchTransactions(wallet, selectedChain) {
    try {
      let apiUrl = ""
      if (selectedChain == "devnet") {
        apiUrl = `https://api-${selectedChain}.helius.xyz/v0/addresses/${wallet}/transactions?api-key=a40dc3a4-ca63-45d4-b196-7952dd75348f`;
      } else if (selectedChain == "mainnet") {
        apiUrl = `https://api.helius.xyz/v0/addresses/${wallet}/transactions?api-key=a40dc3a4-ca63-45d4-b196-7952dd75348f`;
      }
      console.log(apiUrl)
      const response = await axios.get(apiUrl);
      setTransactionData(response.data.reverse());
      console.log(transactionData)
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  const fetchBalance = async (wallet, selectedChain) => {
    setLoading(true);
    setError(null);
    if (selectedChain !== "devnet") {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getBalance`, {
          params: { wallet: wallet, network: selectedChain },
        });
        return res.data.balance;
      } catch (err) {
        setError(err.message);
        return 0;
      } finally {
        setLoading(false);
      }
    } else {
      return 0;
    }
  };

  const fetchAllBalances = async () => {
    if (accountkeys != "[]") {
      setLoading(true);
      try {
        const updatedAccountKeys = await Promise.all(
          accountkeys.map(async (account) => {
            const balance = await fetchBalance(account.publicKey, selectedChain);
            return { ...account, usdbal: balance };
          })
        );

        setAccountKeys(updatedAccountKeys);
      } catch (error) {
        setError("Error fetching all balances");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

  };

  function getAccountArray() {
    const account = JSON.parse(localStorage.getItem(password) || "[]");
    const publicKeys = account.map(secretKeyBase58 => {
      try {
        const secretKey = bs58.decode(secretKeyBase58);
        const recoveredWallet = Keypair.fromSecretKey(secretKey);
        return recoveredWallet.publicKey.toString();
      } catch (error) {
        console.error("Failed to decode or recover Keypair:", error);
        return null;
      }
    });
    const accountKeys = account.map(secretKeyBase58 => {
      try {
        const secretKey = bs58.decode(secretKeyBase58);
        const recoveredWallet = Keypair.fromSecretKey(secretKey);

        return {
          publicKey: recoveredWallet.publicKey.toString(),
          secretKey: secretKeyBase58,
          usdbal: 0
        };
      } catch (error) {
        console.error("Failed to decode or recover Keypair:", error);
        return null;
      }
    });
    // setAccountKeys(accountKeys.filter(keyPair => keyPair !== null))
    const currentAccount = accountKeys.find(key => key.publicKey === wallet);
    if (currentAccount) {
      setSelectedAccountVal({
        publicKey: currentAccount.publicKey,
        usdbal: currentAccount.usdbal,
        privateKey: currentAccount.secretKey,
      });
    }
    const keys = accountKeys.filter(keyPair => keyPair !== null);
    setAccountKeys(keys);
    return accountKeys.filter(keyPair => keyPair !== null);
    // return publicKeys.filter(publicKey => publicKey !== null);
  }


  const handleImportClick = () => {
    const accountArray = getAccountArray();
    setAccountKeys(accountArray);
    // if (accountArray.length > 0 && !selectedAccount) {
    //   setSelectedAccount(accountArray[0]);
    // }
    // console.log(accounts)
    // console.log(accountkeys)
    setShowPopup(true);
    fetchAllBalances();
  };
  const handleAccountSelect = (account) => {
    // console.log(account)
    setSelectedAccount(account);
    setWallet(account.publicKey);
    setSeedPhrase(account.secretKey);
    localStorage.setItem("privatekey", account.secretKey);
    closePopup();
  };

  const truncateAddress = (address) => {
    if (address.length > 10) {
      return `${address.slice(0, 4)}...${address.slice(-6)}`;
    }
    return address;
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowPopupdiv(false);

  };

  async function getAccountTokens() {
    // fetchTransactions(wallet, selectedChain);
    try {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getTokens`, {
        params: { userAddress: wallet, network: selectedChain },
      });
      const response = res.data;
      if (response.tokens.length > 0) setTokens(response.tokens);
      if (response.nfts.length > 0) setNfts(response.nfts);
      setAccountTokens(response.tokens);
      setBalance(response.balance);
    } catch (error) {
      console.error("Error fetching account tokens:", error);
      message.error("Failed to fetch account tokens");
    } finally {
      setFetching(false)
    }
  }

  async function getBalance() {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getBalance`, {
      params: { wallet: wallet, network: selectedChain },
    });
    console.log(res.data.balance)
  }

  function show() {
    setShowPopupdiv(true)
    setShowPopup(false)
    console.log("button pressed")
  }



  function logout() {
    setSeedPhrase(null);
    setWallet(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    navigate("/");
  }
  function recover() {
    setSeedPhrase(null);
    setWallet(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    navigate("/recover");
  }
  function recoverseed() {
    setSeedPhrase(null);
    setWallet(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    navigate("/recoverseed");
  }
  function create() {
    setSeedPhrase(null);
    setWallet(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    navigate("/confirmwallet");
  }

  useEffect(() => {
    if (wallet && selectedChain) {
      getAccountTokens();
      getAccountArray();
      fetchAllBalances()
      // getBalance();
      // fetchBalance(wallet,selectedChain);
      // fetchTransactions(wallet,selectedChain);
    }
  }, [wallet, selectedChain]);
  useEffect(() => {
    if (authTab) {
      setTab(authTab.tab)
      console.log(authTab)
    }
  }, [authTab])
  useEffect(() => {
    closePopup();

  }, [tab])
  return (
    <>
      {
        openModal && <div className="absolute z-[11] bg-[#ffffff33] h-[560px] w-[350px]" onClick={() => setOpenModal(false)}></div>
      }
      {tab === 4 && <>
        <div className="gradient-blue z-[1]"></div>
        <div className="content relative bg-black overflow-x-hidden overflow-y-hidden overflow-hidden max-w-[350px] w-full">
          <div className="w-full">
            <header className="p-4 flex items-center justify-between text-white w-full">
              <div className="w-7"></div>
              <div
                className="bg-transparent border-[0.8px] border-[#c6b8f8] px-2 h-[30px] select-wallet rounded-[10px] text-white flex justify-center items-center gap-2 cursor-pointer relative z-[4]"
                onClick={handleWalletDropDown}
              >
                <span className="">Wallet</span>
                <img src={triangle} alt="triangle" className="w-2 h-2" />
              </div>
              <div className="pr-2 relative z-[16]">
                <img src={setting} className="" alt="Network Modal" onClick={() => setOpenModal(!openModal)} />
                {
                  openModal && <>
                    <div className="w-[208px] bg-[#080808] rounded-[10px] absolute top-[150%] right-0 z-[10]">
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
                      {wallet &&
                        <>
                          <div className="my-[3px] h-[1px] bg-[#1D1D1D] w-full"></div>
                          <div className="px-2 pb-4 pt-2.5 w-full flex flex-col gap-4">
                            <div className="text-[#474747] text-[13px] text-start font-medium font-['Urbanist']">Security</div>
                            <div className="flex items-center cursor-pointer" onClick={() => {
                              setAuthTab(() => ({ tab: 2, innerTab: 1 }))
                              setOpenModal(false)
                            }}>
                              <img src={scan2} alt="Scan" />
                              <div className="text-white text-xs font-medium font-['Urbanist'] pl-[5px]">Generate 2FA QR code</div>
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => {
                              setAuthTab(() => ({ tab: 2, innerTab: 2 }))
                              setOpenModal(false)
                            }}>
                              <img src={security2} alt="Security" />
                              <div className="text-white text-xs font-medium font-['Urbanist'] pl-[5px]">Setup transaction pin</div>
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => {
                              setAuthTab(() => ({ tab: 2, innerTab: 3 }))
                              setOpenModal(false)
                            }}>
                              <img src={key4} alt="Key" />
                              <div className="text-white text-xs font-medium font-['Urbanist'] pl-[5px]">Reveal private Key</div>
                            </div>
                          </div>
                        </>
                      }
                    </div>
                  </>
                }
              </div>
            </header>
          </div>
          <div className="z-[2] max-w-full w-full">
            <WalletHeader
              wallet={wallet} />
            <div className="text-[#A8A8A8] font-sans text-xs">Total Balance</div>
            <div className="font-bold text-white text-[40px] leading-[43px] flex items-center justify-center gap-1">
              <p>{balance} SOL</p>
              <FontAwesomeIcon
                icon={faSyncAlt}
                style={{ cursor: "pointer", fontSize: "12px" }}
                onClick={getAccountTokens}
              />
            </div>
            <div className="flex justify-center items-center gap-1.5 mb-2.5">
              <div className="text-center text-white text-sm font-normal font-urbanist leading-[17px]">+$234</div>
              <div className="h-[24.51px] px-2 py-1 bg-[#17872a] rounded-lg border border-[#17872a] flex-col justify-end items-center gap-2 inline-flex text-center text-white text-[13px] font-normal leading-[18px]">
                +30.23%
              </div>
            </div>
            {fetching ? (
              <Spin className="" />
            ) : (
              <>
                <div className="flex justify-center gap-2.5">
                  <div className=""
                    onClick={() => setTab(1)}
                  >
                    <div className="w-[70px] h-[70px] rounded-full bg-[#1D1D1D] flex justify-center items-center hover:bg-[#000000e5] transition-all duration-200">

                      <img src={send} alt="Send" className=" -ml-1 -mb-1" />
                    </div>
                    <div className="text-center text-white text-[13px] font-normal font-urbanist leading-[17px] pt-2.5">Send</div>
                  </div>
                  <div className=""
                    onClick={() => setTab(6)}
                  >
                    <div className="w-[70px] h-[70px] rounded-full bg-[#1D1D1D] flex justify-center items-center hover:bg-[#000000e5] transition-all duration-200">
                      <img src={recieve} alt="Receive" className="" />
                    </div>
                    <div className="text-center text-white text-[13px] font-normal font-urbanist leading-[17px] pt-2.5">Receive</div>
                  </div>
                  <div className=""
                    onClick={() => setTab(3)}
                  >
                    <div className="w-[70px] h-[70px] rounded-full bg-[#1D1D1D] flex justify-center items-center hover:bg-[#000000e5] transition-all duration-200">
                      <img src={swap} alt="Swap" />
                    </div>
                    <div className="text-center text-white text-[13px] font-normal font-urbanist leading-[17px] pt-2.5">Swap</div>
                  </div>
                </div>
                <div className="px-4 w-full py-4">
                  {
                    tab === 4 && <AssetsTab tokens={tokens} />
                  }
                </div>
              </>
            )}
            {showPopup && (
              <div className="absolute bottom-0 left-0 right-0 bg-black text-white rounded-t-2xl shadow-lg animate-slide-up mb-[90px]">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <ArrowLeftOutlined className="text-xl mr-4 cursor-pointer" onClick={closePopup} />
                    <h3 className="text-sm flex-grow text-center">Select Account</h3>
                  </div>
                  <List
                    dataSource={accountkeys}
                    className="max-h-[250px] overflow-y-auto scrollbar-none"
                    renderItem={(account) => (
                      <List.Item
                        onClick={() => handleAccountSelect(account)}
                        className="cursor-pointer hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center w-full">
                            <div className="w-8">
                              {account.publicKey === wallet ? (
                                <CheckCircleFilled className="text-purple-500" />
                              ) : (
                                <CheckCircleOutlined className="text-gray-400" />
                              )}
                            </div>
                            <span className="text-white flex-grow text-center">
                              {truncateAddress(account.publicKey)}
                            </span>

                            <span className="text-green-400 ml-4">
                              {loading && selectedChain === "mainnet"
                                ? "Loading..."
                                : selectedChain === "mainnet"
                                  ? `$${account.usdbal}`
                                  : "$0.00"}
                            </span>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />

                  {error && (
                    <p style={{ color: "red" }}>Error: {error}</p>
                  )}

                </div>
                <button className="frontPageButton1 mb-4" style={{ marginTop: "0px" }} onClick={show}>Add New Account</button>
              </div>
            )}

          </div>
          <div className="flex items-center justify-center px-4 w-full border-t-[1px] border-[#1D1D1D] gap-[35px] py-6 mt-auto sticky bottom-0 z-[10] bg-black">
            {
              tab === 4 ? <img src={assetfill} alt={"Assets"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(4)} /> : <img src={asset} alt={"Assets"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(4)} />
            }
            {tab === 5 ? <img src={filltransactionImg} alt={"Transaction"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(5)} /> : <img src={transactionImg} alt={"Transaction"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(5)} />}
            {
              tab === 3 ? <img src={fillswap} alt={"Swap"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(3)} /> : <img src={swap3} alt={"Swap"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(3)} />
            }
            <img src={sendb} alt={"Send"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(1)} />
            <img src={recieveb} alt={"Recieve"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(6)} />
          </div>
        </div>
      </>}
      {tab !== 4 && tab !== null && <div className="bg-black p-5 h-[560px] overflow-y-auto scrollbar-none w-[350px]">
        {tab !== 2 && <BackArrow setTab={setTab} />}
        {
          tab === 2 ? <SecurityTab wallet={wallet} accountkeys={accountkeys} authTab={authTab} setTab={setTab} /> : tab === 1 ? <SendTab wallet={wallet} balance={balance} selectedChain={selectedChain} getAccountTokens={getAccountTokens} transactionHistory={transactionData} /> :
            tab === 5 ? <TransactionHistory wallet={wallet} selectedChain={selectedChain} /> :
              tab === 3 ? <SwapTab wallet={wallet} tokens={tokens} balance={balance} selectedChain={selectedChain} getAccountTokens={getAccountTokens} /> :
                tab === 6 && <ReceiveTab wallet={wallet} />
        }
      </div>}
      {showPopupdiv && (
        <div className="absolute top-0 bg-black bg-opacity-50 z-50 flex items-end mt-64">
          <div className="content bg-black w-full max-w-full border-stone-200 max-h-[45vh]">
            <div className="bg-black text-white p-6 slide-up">
              <div className="flex items-center mb-6">
                <ArrowLeftOutlined className="text-lg mr-4" onClick={closePopup} />
                <h3 className="text-sm font-bold ml-10 ">Import Existing Wallet</h3>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => recover()}
                  className="frontPageButton2"
                  type="default"
                >
                  By Private Key
                </button>
                <Button
                  onClick={(e) => recoverseed()}
                  className="frontPageButton1 border-purple-950 font-semibold"
                  type="default"
                >
                  By Mnemonic Phrase
                </Button>

                <button
                  onClick={() => create()}
                  className="frontPageButton3"
                  type="primary"
                >
                  Create a New Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>

  );
}

export default WalletView;