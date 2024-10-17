import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Divider, Spin, Tabs, message, Button, List } from "antd";
import { LogoutOutlined, PlusCircleOutlined, ArrowLeftOutlined, CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
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


function WalletView({ wallet, setWallet, setSeedPhrase, selectedChain, password, account, authTab }) {
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
  return (
    <>
      <div className="gradient-blue z-[1]"></div>
      <div className="content relative bg-black overflow-x-hidden overflow-y-hidden overflow-hidden max-w-[350px] w-full">
        <div className="z-[2] max-w-full w-full">
          <div className="addButton text-white" onClick={handleImportClick}>
            <PlusCircleOutlined />
          </div>
          <WalletHeader wallet={wallet} selectedChain={selectedChain} balance={balance} />
          <div className="text-[#A8A8A8] font-sans text-xs mb-2.5">Total Balance</div>
          <div className="font-bold text-white text-[40px] flex items-center justify-center gap-1">
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
                  <img src={send} alt="Send" />
                  <div className="text-center text-white text-[13px] font-normal font-urbanist leading-[17px] pt-2.5">Send</div>
                </div>
                <div className=""
                  onClick={() => setTab(2)}
                >
                  <img src={recieve} alt="Receive" />
                  <div className="text-center text-white text-[13px] font-normal font-urbanist leading-[17px] pt-2.5">Receive</div>
                </div>
                <div className=""
                  onClick={() => setTab(3)}
                >
                  <img src={swap} alt="Swap" />
                  <div className="text-center text-white text-[13px] font-normal font-urbanist leading-[17px] pt-2.5">Swap</div>
                </div>
              </div>
              <div className="px-4 w-full py-4">
                {
                  tab === 4 ? <AssetsTab tokens={tokens} /> :
                    tab === 1 ? <SendTab wallet={wallet} balance={balance} selectedChain={selectedChain} getAccountTokens={getAccountTokens} transactionHistory={transactionData} /> :
                      tab === 2 ? <SecurityTab wallet={wallet} accountkeys={accountkeys} authTab={authTab} /> :
                        tab === 5 ? <TransactionHistory wallet={wallet} selectedChain={selectedChain} /> :
                          <SwapTab wallet={wallet} tokens={tokens} balance={balance} selectedChain={selectedChain} getAccountTokens={getAccountTokens} />
                }
              </div>
            </>
          )}
          {showPopup && (
            <div className="absolute bottom-0 left-0 right-0 bg-black text-white rounded-t-2xl shadow-lg animate-slide-up">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <ArrowLeftOutlined className="text-xl mr-4 cursor-pointer" onClick={closePopup} />
                  <h3 className="text-sm flex-grow text-center">Select Account</h3>
                </div>
                <List
                  dataSource={accountkeys}
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
              <button className="frontPageButton1 mb-4" onClick={show}>Add New Account</button>
            </div>
          )}

          <style>{`
          .content {
            overflow-y: auto;
          }
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out forwards;
          }
        `}</style>

          {showPopupdiv && (
            <div className="fixed  bg-black bg-opacity-50 z-50 flex items-end mt-64">
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

          <style>{`
        .slide-up {
          animation: slide-up 0.3s ease-out;
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
        <div className="flex items-center justify-center px-4 w-full border-t-[1px] border-[#1D1D1D] gap-[35px] py-[15px] mt-auto mb-4 sticky bottom-0 z-[10] bg-black pb-8">
          {
            tab == 4 ? <img src={assetfill} alt={"Assets"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(4)} /> : <img src={asset} alt={"Assets"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(4)} />
          }
          {tab === 5 ? <img src={filltransactionImg} alt={"Transaction"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(5)} /> : <img src={transactionImg} alt={"Transaction"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(5)} />}
          {
            tab === 3 ? <img src={fillswap} alt={"Swap"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(3)} /> : <img src={swap3} alt={"Swap"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(3)} />
          }
          <img src={send} alt={"Send"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(1)} />
          <img src={recieve} alt={"Recieve"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(2)} />
        </div>
      </div>
    </>

  );
}

export default WalletView;