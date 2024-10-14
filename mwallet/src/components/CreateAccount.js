import React, { useState, useEffect } from "react";
import { Button, Card, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import wallet from "../images/wallet.png";


function CreateAccount({ setWallet, setSeedPhrase, password, setPassword, confirmpassword, setConfirmPassword }) {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const navigate = useNavigate();
  const [mnemonic, setMnemonic] = useState(null);
  const [loading, setLoading] = useState(false);
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const handleMnemonic = () => {
    const inp = document.querySelectorAll(".input-mnemonic");
    let str = "";
    inp.forEach(item => {
      str += item.value;
    })
    setMnemonic(str);
  }
  console.log(mnemonic);
  async function generateWallet() {
    const newMnemonic = bip39.generateMnemonic();
    setMnemonic(newMnemonic);
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



  return (
    <>
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
        <div className="content bg-black">
          <div className="mnemonic">
            <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
            <div className="bg-black text-white">
              Once you set the password, a seedphrase will generate save it securely in order to
              recover your wallet in the future.
            </div>
          </div>

          <Button
            className="frontPageButton1"
            type="primary"
            onClick={() => generateWallet()}
          >
            Create Account
          </Button>
          <div className="grid grid-cols-3 gap-[7px] py-4 w-full px-4">
            {
              arr.map((item, idx) => <div className="py-2.5 px-2  bg-[#080808]  border-[0.8px] border-[#1D1D1D] rounded-[8px] flex gap-1" key={idx}>
                <span className="block text-[#474747] text-[12px] ">{item}.</span>
                <input className="block w-full font-urbanist tetx-[14px] text-white bg-transparent outline-none border-none input-mnemonic" onChange={handleMnemonic} />

              </div>)
            }
          </div>

          <Button
            className="frontPageButton1"
            type="default"
            onClick={() => setWalletAndMnemonic()}
            disabled={!newSeedPhrase}
            hidden={!newSeedPhrase}
          >
            Open Your New Wallet
          </Button>
          <p className="frontPageBottom mt-2" onClick={() => navigate("/")}>
            Back Home
          </p>
        </div>
      )}
    </>

  );
}

export default CreateAccount;