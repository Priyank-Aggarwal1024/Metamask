import React, { useState } from "react";
import { BulbOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

function SignInPwd({ setWallet, setSeedPhrase, setPassword }) {
    const navigate = useNavigate();
    const { pathname } = useLocation()
    console.log(pathname)
    const [typedSeed, setTypedSeed] = useState("");
    const [nonValid, setNonValid] = useState(false);


    function seedAdjust(e) {
        setNonValid(false);
        setTypedSeed(e.target.value);
    }


    function recoverWallet() {

        let recoveredWallet;
        try {
            const passRecovered = JSON.parse(localStorage.getItem(typedSeed.trim()) || "[]");
            const pass = passRecovered[0];
            if (pass != null) {
                const secretKey = bs58.decode(pass);
                recoveredWallet = Keypair.fromSecretKey(secretKey);
            }
            else {
                setNonValid(true);
                return;
            }
        } catch (err) {
            setNonValid(true);
            return;
        }
        setSeedPhrase(typedSeed);
        setWallet(recoveredWallet.publicKey.toString());
        setPassword(typedSeed.trim())
        navigate("/yourwallet");
        return;
    }

    return (
        <>
            <div className="content bg-black">
                <div className="mnemonic">
                    <BulbOutlined style={{ fontSize: "20px", padding: "10px" }} />
                    <div>
                        Enter your password
                    </div>
                </div>
                <Input.Password
                    value={typedSeed}
                    onChange={seedAdjust}
                    className=" custom-password-input passwordContainer1"
                    placeholder="Enter Password"
                />

                <Button
                    disabled={typedSeed.trim().length === 0}
                    className="frontPageButton1"
                    type="primary"
                    onClick={() => recoverWallet()}
                >
                    Sign In
                </Button>
                {nonValid && <p style={{ color: "red" }}>Invalid Password</p>}
                <p className="frontPageBottom mt-[320px]" onClick={() => navigate("/")}>
                    <span>Back Home</span>
                </p>
            </div>
        </>
    );
}

export default SignInPwd;
