import React, { useState } from "react";
import { Tooltip, QRCode, Select } from "antd";
import SOL from "../images/Solana_logo.png"


function WalletHeader({ wallet, selectedChain, balance }) {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };
  const handleChange = () => {

  }
  return (
    <>
      <Select
        defaultValue="Wallet"
        className="bg-transparent border-[0.8px] select-wallet rounded-[10px] text-white w-[86px] my-2 mb-3"
        onChange={handleChange}
        options={[
          {
            value: 'Wallet',
            label: 'Wallet',
          }
        ]}
      />
      <div className="w-96">
        <Tooltip
          className="tools text-white" overlayStyle={{ width: '500px' }}
          title={
            <div className="toolTip">
              <div className="title">Receive Crypto</div>
              <QRCode value={wallet} icon={SOL} size={128} className="qrcode" />
              <div className="walletInfo">
                <div className="walletLabel">Wallet Address: </div>
                <div className="walletAddress">{wallet}</div>
                <button onClick={handleCopy} className="text-blue-600">
                  Copy Address
                </button>
                {copySuccess && <span className="text-red-700">{copySuccess}</span>}
              </div>
              <div className="networkInfo">Network: {selectedChain}</div>
            </div>
          }
        >
          <div className="mt-[-6px] max-w-[350px] w-full">
            {wallet.slice(0, 4)}...{wallet.slice(38)}
          </div>
        </Tooltip>
      </div>
    </>
  );
}

export default WalletHeader;
