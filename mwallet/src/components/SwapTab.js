import React, { useEffect, useState } from "react";
import { message, Select, ConfigProvider } from "antd";
import axios from "axios";
import { Connection, PublicKey, Keypair, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import USD from '../images/usd-coin.png';
import BONK from '../images/bonk.png';
import WIF from '../images/dog.png';
import SOL from "../images/Solana_logo.png"

function SwapTab({ wallet, tokens, balance, getAccountTokens, selectedChain }) {
  const [swapFromToken, setSwapFromToken] = useState("");
  const [swapToToken, setSwapToToken] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapQuote, setSwapQuote] = useState(null);
  const [finalSwapAmount, setFinalSwapAmount] = useState("");
  const [finalSwapFromToken, setFinalSwapFromToken] = useState("");
  const [finalSwapToToken, setFinalSwapToToken] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [storedPassword, setStoredPassword] = useState("");
  const { Option } = Select;

  const assets = [
    { name: 'SOL', symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112', decimals: 9, imgURL: SOL },
    { name: 'USDC', symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6, imgURL: USD },
    { name: 'BONK', symbol: 'BONK', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', decimals: 5, imgURL: BONK },
    { name: 'WIF', symbol: 'WIF', mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', decimals: 6, imgURL: WIF },
  ];
  const selectedAsset = assets.find(asset => asset.symbol === swapToToken);


  useEffect(() => {
    const pinSetup = JSON.parse(localStorage.getItem("pinSetup") || "{}");
    setStoredPassword(pinSetup[wallet] || "");
  }, [wallet]);


  async function getSwapQuote() {
    setSwapQuote(null);
    if (selectedChain == "devnet") {
      message.error("SWAP not available on devnet!")
    } else {
      console.log(swapFromToken)
      console.log(swapToToken)
      console.log(swapAmount)
      if (!swapFromToken || !swapToToken || !swapAmount) {
        message.error("Please fill in all swap details");
        return;
      }
      const fromToken = tokens.find(token => token.symbol === swapFromToken);
      const toToken = assets.find(asset => asset.symbol === swapToToken);
      setFinalSwapToToken(toToken)
      setFinalSwapFromToken(fromToken)
      console.log(swapAmount)
      console.log(fromToken.amount)
      if (swapAmount <= fromToken.amount) {
        try {
          const response = await axios.get(
            `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${swapAmount * Math.pow(10, fromToken.decimals)}&slippageBps=50`
          );
          setFinalSwapAmount(response.data.outAmount / Math.pow(10, toToken.decimals))
          setSwapQuote(response.data);
        } catch (error) {
          console.error("Error fetching swap quote:", error);
          message.error("Failed to fetch swap quote");
        }
      } else {
        message.error("Enter Amount Less than current balance!")
      }

    }
  }


  async function executeSwap() {
    if (!swapQuote) {
      message.error("Please get a quote first");
      return;
    }


    try {
      const swapResponse = await axios.post("https://quote-api.jup.ag/v6/swap", {
        quoteResponse: swapQuote,
        userPublicKey: wallet,
        wrapAndUnwrapSol: true,
      });

      const swapTransactionBuf = Buffer.from(swapResponse.data.swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      const secretKeyString = localStorage.getItem("privatekey");
      const secretKey = bs58.decode(secretKeyString);
      const keypair = Keypair.fromSecretKey(secretKey);

      transaction.sign([keypair]);

      const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=a40dc3a4-ca63-45d4-b196-7952dd75348f', "confirmed");
      const rawTransaction = transaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });
      const latestBlockHash = await connection.getLatestBlockhash();
      // await connection.confirmTransaction(txid);
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      }, 'confirmed');
      function getCurrentDateTime() {
        const currentDateTime = new Date();
        const year = currentDateTime.getFullYear();
        const month = String(currentDateTime.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const day = String(currentDateTime.getDate()).padStart(2, "0");
        const hours = String(currentDateTime.getHours()).padStart(2, "0");
        const minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
        const seconds = String(currentDateTime.getSeconds()).padStart(2, "0");
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDateTime;
      }
      const transactionData1 = {
        amount: swapAmount,
        signature: txid,
        toAddress: finalSwapToToken.mint,
        token: finalSwapFromToken.symbol,
        type: "Swap Out",
        dateTime: getCurrentDateTime(),
      };
      const transactionData2 = {
        amount: finalSwapAmount,
        signature: txid,
        toAddress: finalSwapFromToken.mint,
        token: finalSwapToToken.symbol,
        type: "Swap In",
        dateTime: getCurrentDateTime(),
      };
      const walletAddress = wallet;
      const existingTransactions =
        JSON.parse(localStorage.getItem(walletAddress)) || [];
      existingTransactions.push(transactionData1);
      localStorage.setItem(walletAddress, JSON.stringify(existingTransactions));
      existingTransactions.push(transactionData2);
      localStorage.setItem(walletAddress, JSON.stringify(existingTransactions));

      message.success(`Swap executed successfully.`);
      getAccountTokens();
      setSwapFromToken("");
      setSwapToToken("");
      setSwapAmount("");
      setSwapQuote(null);
      setFinalSwapAmount("");
      setFinalSwapFromToken("");
      setFinalSwapToToken("");
    } catch (error) {
      console.error("Error executing swap:", error);
      message.error("Failed to execute swap");
    }
  }
  const handleChange = (value) => {
    setSwapToToken(value);
  };



  const handleSelectChange = (assetSymbol) => {
    setSwapToToken(assetSymbol);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <h3 className="text-white font-bold">Swap Tokens</h3>
      <div className="swapRow">
        <div className="flex justify-end space-x-3 text-gray-400 ">
          <button className="hover:text-purple-900" onClick={() => setSwapAmount((balance * 0.1).toFixed(2))}>10%</button>
          <button className="hover:text-purple-900" onClick={() => setSwapAmount((balance * 0.2).toFixed(2))}>20%</button>
          <button className="hover:text-purple-900" onClick={() => setSwapAmount((balance * 0.5).toFixed(2))}>50%</button>
          <button className="hover:text-purple-900" onClick={() => setSwapAmount(balance)}>MAX</button>
        </div>

        <div className="swapContainer" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div>
            <p className="m-2 text-gray-600 text-left">Source</p>
            <div style={{ position: 'relative', width: '100px', backgroundColor: "black" }}>
              <ConfigProvider
                theme={{
                  token: {
                    colorBgContainer: 'black',
                    colorText: 'white',
                    colorBorder: 'black',


                  },
                }}
              >
                <Select
                  placeholder="Select"
                  optionLabelProp="label"
                  style={{
                    borderRadius: "10px",
                    width: "120px",
                    backgroundColor: "black",
                    color: "white",
                    height: "35px",
                    border: "3px solid black",
                  }}
                  dropdownStyle={{
                    backgroundColor: "black",
                    color: "white",
                    border: "1px solid #333",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                  value={swapFromToken || undefined}
                  onChange={(value) => setSwapFromToken(value)}
                >
                  {tokens &&
                    tokens.map((token) => (
                      <Option
                        key={token.symbol} // Changed to token.symbol
                        value={token.symbol}
                        style={{ backgroundColor: "black", color: "white" }}
                        label={
                          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: "black", color: "white" }}>
                            <img
                              src={SOL}
                              alt={token.symbol}
                              style={{ width: '20px', height: '20px', marginRight: '10px' }}
                            />
                            {token.symbol}
                          </div>
                        }
                      >
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: "black", color: "white" }}>
                          <img
                            src={SOL}
                            alt={token.symbol}
                            style={{ width: '20px', height: '20px', marginRight: '10px' }}
                          />
                          {token.symbol}
                        </div>
                      </Option>
                    ))}
                </Select>
              </ConfigProvider>




            </div>
          </div>

          <div className="ml-16">
            <p className="m-2 text-gray-600 text-right">Amount:</p>
            <input
              style={{
                textAlign: "right",
                borderRadius: "10px",
                width: "80%",


              }}
              value={swapAmount}
              className="bg-gray-900 text-white w-full h-[35px] border border-black pr-3 ml-9"
              onChange={(e) => setSwapAmount(e.target.value)}
              placeholder="Enter Amount"
              type="text"
            />
          </div>
        </div>
      </div>


      <div className="swapContainer" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div>
          <p className="m-2 text-gray-600 text-left">Destination</p>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: 'black',
                colorText: 'white',
                colorBorder: 'black',
              },
            }}
          >
            <Select
              style={{
                width: '120px',
                backgroundColor: 'black',
                color: 'white',
              }}
              value={selectedAsset ? selectedAsset.symbol : undefined}
              onChange={handleChange}
              placeholder="Select"
              dropdownStyle={{ backgroundColor: 'black' }}
            >
              {assets.map((asset) => (
                <Option key={asset.mint} value={asset.symbol}> {/* Ensure key is unique */}
                  <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                    <img
                      src={asset.imgURL}
                      alt={asset.name}
                      style={{ width: '20px', height: '20px', marginRight: '10px' }}
                    />
                    {asset.name}
                  </div>
                </Option>
              ))}
            </Select>

          </ConfigProvider>
        </div>

        {swapQuote && (
          <div className="quoteInfo">
            <p
              style={{
                borderRadius: "10px",
                backgroundColor: "black",
                color: "white",
                height: "35px",
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                width: "40%",
                marginTop: "40px",
                marginLeft: "100px"
              }}
            >
              {finalSwapAmount}
            </p>
          </div>
        )}
      </div>

      <button
        className="frontPageButton1"
        style={{ width: "100%", marginTop: "20px" }}
        type="primary"
        onClick={getSwapQuote}
      >
        Get Quote
      </button>
      {swapQuote && (
        <div className="quoteInfo">
          <p>Price impact: {swapQuote.priceImpactPct}%</p>
          <button
            className="frontPageButton1 mb-8"
            style={{ width: "100%", marginTop: "20px" }}
            type="primary"
            onClick={executeSwap}
          >
            Execute Swap
          </button>
        </div>
      )}
    </>
  );
}

export default SwapTab;