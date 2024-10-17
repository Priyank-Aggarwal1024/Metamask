import React, { useState, useEffect } from "react";
import { Button, Card, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import wallet from "../images/wallet.png";
import BackHome from "./BackHome";


function CreateAccount({ setWallet, setSeedPhrase, password, setPassword, confirmpassword, setConfirmPassword }) {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const navigate = useNavigate();
  const [mnemonic, setMnemonic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [arr, setArr] = useState(mnemonic?.split(" "));
  const handleMnemonic = () => {
    const inp = document.querySelectorAll(".input-mnemonic");
    let str = "";
    inp.forEach(item => {
      str += item.value;
      str += " ";
    })
    setMnemonic(str);
  }
  console.log(mnemonic);
  async function generateWallet() {
    const newMnemonic = bip39.generateMnemonic();
    setMnemonic(newMnemonic);
    setArr(newMnemonic?.split(" "))
    const seed = await bip39.mnemonicToSeed(newMnemonic);
    const derived = derivePath("m/44'/501'/0'/0'", seed.toString("hex")).key;

    const keypair = Keypair.fromSeed(derived);
    const secretKey = bs58.encode(keypair.secretKey);
    setNewSeedPhrase(secretKey);
  }
  function setWalletAndMnemonic() {
    const keypair = Keypair.fromSecretKey(bs58.decode(newSeedPhrase));
    let account;
    try {
      account = JSON.parse(localStorage.getItem(password) || "[]");
    } catch {
      account = []
    }
    if (!account.includes(newSeedPhrase)) {
      account.push(newSeedPhrase);
      localStorage.setItem(password, JSON.stringify(account));
    } else {
      console.log("Account already added");
    }
    localStorage.setItem('privatekey', newSeedPhrase);
    setLoading(true);
    setTimeout(() => {
      setPassword(password)
      setLoading(false);
      setSeedPhrase(newSeedPhrase);
      setWallet(keypair.publicKey.toString());
      navigate("/yourwallet");
    }, 2000);

  }

  console.log(mnemonic)

  return (
    <>
      <BackHome />
      {loading ? (
        <div className="loading bg-black w-full flex justify-center items-center">
          <div className="mt-36">
            <img src={wallet} alt="" className="w-24 ml-20" />
            <div className="text-white font-semibold">Setting Up Wallet</div>
            <div className="text-white">We are loading up your new wallet</div>
            <div className="spinner">
              <div className="rect1"></div>
              <div className="rect2"></div>
              <div className="rect3"></div>
              <div className="rect4"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="content bg-black pt-4">
          <h1 className="text-white font-sans text-2xl mt-5 font-semibold w-full pl-4 text-start">Mnemonic Phrase</h1>
          <h3 className="text-[#474747] font-sans text-xs w-full mt-2 pl-4 text-start">The phrase is the only way for you to recover your wallet do not share with anyone</h3>

          <Button
            className="frontPageButton1"
            type="primary"
            onClick={() => generateWallet()}
          >
            Create Account
          </Button>
          <div className="grid grid-cols-3 gap-[7px] py-4 w-full px-4">
            {
              arr?.map((item, idx) => <div className="py-2.5 px-2  bg-[#080808]  border-[0.8px] border-[#1D1D1D] rounded-[8px] flex gap-1 items-center" key={idx}>
                <span className="block text-[#474747] text-[12px] ">{idx + 1}.</span>
                <input className="block w-full font-urbanist tetx-[14px] text-white bg-transparent outline-none border-none input-mnemonic" onChange={handleMnemonic} value={item} readOnly />

              </div>)
            }
          </div>
          <Button
            className="frontPageButton1"
            type="default"
            onClick={() => navigator.clipboard.writeText(mnemonic)}
            hidden={!newSeedPhrase}

          >
            Copy Your SeedPhrase
          </Button>
          <Button
            className="frontPageButton1"
            type="default"
            onClick={() => setWalletAndMnemonic()}
            disabled={!newSeedPhrase}
            hidden={!newSeedPhrase}
          >
            Open Your New Wallet
          </Button>

        </div>
      )}
    </>

  );
}

export default CreateAccount;