import React, { useState, useEffect } from "react";
import { BulbOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import wallet from "../images/wallet.png";
import ibutton from '../images/ibutton.svg'


function RecoverAccountSecretKey({ setWallet, setSeedPhrase, password, setPassword }) {
  const navigate = useNavigate();
  const [typedSeed, setTypedSeed] = useState("");
  const [nonValid, setNonValid] = useState(false);
  const [blankPassword, setBlankPassword] = useState(false);
  const { TextArea } = Input;
  // const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmsetPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showpassdiv, setShowpassdiv] = useState(true);
  const [error, setError] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");


  function seedAdjust(e) {
    setNonValid(false);
    setTypedSeed(e.target.value);
    console.log(typedSeed)
  }
  function passAdjust(e) {
    setBlankPassword(false);
    setPass1(e.target.value);
  }
  function confirmpassAdjust(e) {
    setBlankPassword(false);
    setPass2(e.target.value);
  }
  function showdiv() {
    if (pass1 !== pass2) {
      setError("Passwords do not match.");
    } else {
      setconfirmsetPassword(pass2);
      setPassword(pass1)
      setShowpassdiv(false);
    }

  }
  useEffect(() => {
    if (password !== "") {
      setShowpassdiv(false);
    }
  }, []);

  function recoverWallet() {
    let recoveredWallet;
    if (password != "") {
      try {
        const secretKey = bs58.decode(typedSeed.trim());
        recoveredWallet = Keypair.fromSecretKey(secretKey);
        setLoading(true);
        localStorage.setItem('privatekey', typedSeed.trim());
        let account;
        try {
          account = JSON.parse(localStorage.getItem(password) || "[]");
        } catch {
          account = []
        }
        if (!account.includes(typedSeed.trim())) {
          account.push(typedSeed.trim());
          localStorage.setItem(password, JSON.stringify(account));
        } else {
          console.log("Account already added");
        }
        setTimeout(() => {
          setPassword(password)
          setLoading(false);
          setSeedPhrase(typedSeed);
          setWallet(recoveredWallet.publicKey.toString());
          navigate("/yourwallet");
        }, 2000);
      } catch (err) {
        setNonValid(true);
        return;
      }
      // localStorage.setItem(password,typedSeed.trim());     
      return;
    } else {
      setBlankPassword(true);
    }
  }

  return (
    <>
      {loading ? (
        <div className="loading bg-black w-full flex justify-center items-center">
          <div className="mt-36">
            <img src={wallet} alt="" className="w-24 ml-20" />
            <div className="text-white font-semibold">Importing Your Wallet</div>
            <div className="text-white">We are importing your existing wallet</div>
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
            <BulbOutlined style={{ fontSize: "20px" }} />
            <div>
              Paste your base58 encoded secret key in the field below to recover your wallet.
            </div>
          </div>
          {showpassdiv && (<> <Input
            value={pass1}
            onChange={passAdjust}
            className="passwordContainer1"
            placeholder="Enter New Password"
          />
            <Input
              value={pass2}
              onChange={confirmpassAdjust}
              className="passwordContainer1"
              placeholder="Confirm New Password"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button className="frontPageButton1" onClick={showdiv} >Set Password</button>
          </>
          )}

          {!showpassdiv && (
            <>
              <div className="flex-col justify-start items-start gap-2 inline-flex w-full text-start px-5 pt-4">
                <div className="text-white text-[22px] font-semibold font-urbanist">Private Key</div>
                <div className="text-[#474747] text-[15px] font-light font-urbanist leading-[21px]">Enter your private key to import wallet</div>
              </div>
              <TextArea
                value={typedSeed}
                onChange={seedAdjust}
                rows={6}
                className="passwordContainer1"
                placeholder="Enter 1 - 20 Character"
              />
              <div className="px-5 w-full pt-2">
                <div className="w-full bg-[#0b0514] rounded-lg text-[#722ae8] text-[13px] font-medium font-urbanist leading-[15px] py-[15px] px-2.5 flex items-center gap-2">
                  <img src={ibutton} alt="ibutton" />
                  Only solana network is support
                </div>
              </div>
              <Button
                disabled={typedSeed.trim().length === 0 || !password}
                className="frontPageButton1"
                type="primary"
                onClick={() => recoverWallet()}
              >
                Import
              </Button>
            </>
          )}
          {nonValid && <p style={{ color: "red" }}>Invalid Secret Key</p>}
          {blankPassword && <p style={{ color: "red" }}>Enter Password</p>}
          <p className="frontPageBottom mt-2" onClick={() => navigate("/")}>
            <span>Back Home</span>
          </p>
        </div>
      )}
    </>
  );
}

export default RecoverAccountSecretKey;