import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";

function Enterpass({ password, setPassword, confirmpassword, setConfirmPassword }) {
    const [error, setError] = useState("");
    const [pass1, setPass1] = useState("")
    const [pass2, setPass2] = useState("")
    const navigate = useNavigate();


    function passAdjust(e) {
        setPass1(e.target.value);
    }

    function confirmpassAdjust(e) {
        setPass2(e.target.value);
    }

    useEffect(() => {
        setPassword("");
        setConfirmPassword("");
    }, [setPassword, setConfirmPassword]);

    function handleSubmit() {
        if (pass1 !== pass2) {
            setError("Passwords do not match.");
        } else {
            setError("");
            setPassword(pass2)
            setConfirmPassword(pass2)
            navigate("/confirmwallet");
        }
    }

    return (
        <>
            <div className="content bg-black flex flex-col justify-between w-full">
                <div>

                    <h1 className="text-white font-sans text-2xl mt-5 font-semibold w-full pl-4 text-start">Set up password</h1>
                    <h3 className="text-gray-500 font-sans text-xs w-full mt-2 pl-4 text-start">Enhance security by setting up your password</h3>

                    <Input
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

                </div>
                <div className="mt-auto mb-6 w-full">

                    <button
                        className="frontPageButton1"
                        type="primary"
                        onClick={handleSubmit}
                        disabled={pass1 == "" && pass2 == ""}
                    >
                        Proceed
                    </button>
                    <p className="frontPageBottom mt-2" onClick={() => { navigate("/"); setPassword(""); }}>
                        Back Home
                    </p>
                </div>

            </div>
        </>
    );
}

export default Enterpass;