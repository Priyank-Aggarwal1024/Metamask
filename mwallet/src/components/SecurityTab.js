import React, { useState, useEffect } from "react";
import { Button, message, Alert, Popconfirm, Input } from "antd";
import axios from "axios";
import TwoFactorAuth from "./TwoFactorAuth";
import auth from "../images/auth.png"
import auth3 from "../images/auth3.png"
import back from '../images/back.svg'
import view from '../images/view.svg'

function SecurityTab({ wallet, accountkeys }) {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [isVisiblePin, setIsVisiblePin] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [key, setKey] = useState("");
  const [processing, setProcessing] = useState(false);
  const [copy, setcopy] = useState("Copy Private Key");
  const priKey = accountkeys.find(acc => acc.publicKey === wallet);

  useEffect(() => {
    const pinSetup = JSON.parse(localStorage.getItem("pinSetup") || "{}");
    setStoredPassword(pinSetup[wallet] || "");
  }, [wallet]);

  const generate2FA = async () => {
    const setup = JSON.parse(localStorage.getItem("TwoFaSetupz") || "{}");
    if (setup[wallet]) {
      message.error("2FA already setup!");
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/auth/generate-2fa`,
          { userId: wallet }
        );
        setQrCodeUrl(response.data.qrCodeUrl);
        setShow2FASetup(true);
      } catch (error) {
        console.error("Error generating 2FA QR code:", error);
        message.error("Failed to generate 2FA QR code");
      }
    }
  };
  const onClose = (e) => {
    setKey("");
  };

  const handle2FAVerificationSetup = async (otp) => {
    const payload = { userId: wallet, token: otp };

    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/verify-2fa`, payload);
      if (res.data.valid) {
        message.success("2FA verification successful, Setup Successful!");
        let currentSetup = JSON.parse(localStorage.getItem("TwoFaSetupz") || "{}");
        currentSetup[wallet] = true;
        localStorage.setItem("TwoFaSetupz", JSON.stringify(currentSetup));
        setQrCodeUrl(null);
        setShow2FASetup(false);
      } else {
        message.error("Invalid 2FA code. Please try again.");
      }
    } catch (error) {
      console.error("2FA verification failed:", error);
      message.error("Verification failed. Please try again.");
    }
  };

  const generatePin = () => {
    const setup = JSON.parse(localStorage.getItem("pinSetup") || "{}");
    if (setup[wallet]) {
      message.error("PIN already set!");
    } else {
      setIsVisiblePin(true);
    }
  };

  const savePassword = () => {
    if (password === confirmPassword) {
      let currentSetup = JSON.parse(localStorage.getItem("pinSetup") || "{}");
      currentSetup[wallet] = password;
      localStorage.setItem("pinSetup", JSON.stringify(currentSetup));
      setStoredPassword(password);
      message.success("Password set successfully");
      setIsVisiblePin(false);
    } else {
      message.error("Passwords do not match");
    }
  };

  const revealKey = () => {
    setKey(priKey.secretKey);
  };
  const [tab, setTab] = useState(null);
  useEffect(() => {
    setShow2FASetup(false)
  }, [])

  return (
    <>
      {
        !isVisiblePin && !qrCodeUrl && <>
          <div className="flex text-white items-center ml-2 -space-x-5"> <img src={auth} alt="" className="w-24" /> <p className=" text-lg font-bold"> Google Authentication </p>  </div>
          <span className="text-white">Step 1:-</span>{" "}
          <Button className="frontPageButton1" onClick={generate2FA}>Generate 2FA QR Code</Button>
          <p className="mt-6">
            {" "}
            <span className="text-white">Step 2:-</span> <Button className="frontPageButton1" onClick={generatePin}>Setup Transaction PIN</Button>
          </p>
          <p>
            {" "}

            <Button className="frontPageButton1" onClick={revealKey}>Reveal PrivateKey</Button>
          </p>
          {key && (
            <div className="mt-[-200px] mb-30px">
              <Alert
                message={"Please Copy and Close this"}
                description={
                  <div>
                    {key}
                    <br />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(key); setTimeout(() => {
                          setcopy("Copy Private Key")

                        }, 2000); setcopy("Copied")
                      }}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-600"
                    >
                      {copy}
                    </button>
                  </div>
                }
                type="warning"
                closable
                onClose={onClose}
              />
              <br />
            </div>
          )}
        </>
      }
      <>
        {isVisiblePin && (
          <div className="setupPin">
            <img className="py-4" alt="Back" src={back} onClick={() => {
              setIsVisiblePin(false)
              setPassword("")
              setConfirmPassword("")
            }} />
            <div className="passwordRow mt-4">
              {/* <p style={{ width: "150px", textAlign: "left", color: "white" }}>PIN:</p> */}
              <div className="text-white text-[22px] font-semibold font-['Urbanist'] text-start">Set Up Transaction Pin</div>
              <div className="text-[#474747] text-[15px] font-light font-['Urbanist'] leading-[21px] text-start">Please create a 4-digit transaction PIN</div>
              <div className="passwordRow pt-4">
                <p style={{ width: "150px", textAlign: "left", color: "#A8A8A8" }}>Enter PIN:</p>

                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set a new password"
                  className="passwordContainer1 relative"
                  style={{ marginTop: "10px" }}
                  iconRender={() => (<img src={view} alt="Hide Unhide button" />)}
                />
              </div>

              <div className="passwordRow mt-3">
                <p style={{ width: "150px", textAlign: "left", color: "#A8A8A8" }}>Confirm PIN:</p>
                <Input.Password
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="passwordContainer1 relative"
                  style={{ marginTop: "10px" }}
                  iconRender={() => (<img src={view} alt="Hide Unhide button" />)}
                />
              </div>

            </div>
            <Button
              className="frontPageButton1"
              style={{ width: "100%", marginTop: "20px" }}
              type="primary"
              onClick={savePassword}
              disabled={!password || password !== confirmPassword}
            >
              Set Password
            </Button>
          </div>

        )}
      </>
      {qrCodeUrl && (
        <>
          <img className="py-4" alt="Back" src={back} onClick={() => setQrCodeUrl(null)} />
          <div className="text-white text-[22px] font-semibold font-['Urbanist'] text-start">Google Authenticator</div>
          <div className="text-[#474747] text-[15px] font-light font-['Urbanist'] leading-[21px] text-start">Scan the code below to set up your 2FA with google authenticator</div>
          <div className="w-full flex justify-center">

            <div className="relative w-fit py-6 px-8 bg-[#080808] mt-4 flex justify-center rounded-[8px]">
              <img
                src={qrCodeUrl}
                alt="2FA QR Code"
                className="w-[200px] h-[200px]"
              />

              <img
                src={auth3}
                alt="Overlay Img"
                className="absolute  bottom-[85px] left-[148px] w-[40px] bg-black rounded-full "
              />
            </div>
          </div>

          {show2FASetup && (
            <TwoFactorAuth
              onVerify={handle2FAVerificationSetup}
              processing={processing}
            />
          )}
        </>
      )}
    </>
  );
}

export default SecurityTab;
