import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import img from "../images/wallet.png";
import trap from '../images/trap.svg'
import edit from '../images/edit.svg'
import key from '../images/key.svg'
import cloud from '../images/cloud.svg'
import watch from '../images/watch.svg'
import righta from '../images/right-arrow.svg'

function Home() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleImportClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPopup]);

  return (
    <>
      <div className={`content1 h-[500px] bg-black ${showPopup ? 'fixed inset-0' : ''}`}>
        <img src={trap} alt="trap" className="absolute top-0 z-1 max-w-[350px]" />
        <img src={img} alt="logo" className="frontPageLogo mb-4 relative z-[4]" />
        <h2 className="text-white text-3xl font-bold mb-0">Metasafe</h2>
        <h4 className="text-[rgb(71,71,71)] mt-2">The Solana Non Custodial Wallet</h4>
        <div className="mt-60 w-80">
          <button
            onClick={() => navigate("/yourwallet")}
            className="w-full bg-purple-600 text-white py-3 rounded-lg mb-4"
            type="primary"
          >
            Create New Wallet
          </button>
          <button
            onClick={handleImportClick}
            className="w-full bg-gray-800 text-white py-3 rounded-lg"
            type="primary"
          >
            Import Existing Wallet
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed  bg-black bg-opacity-50 z-50 flex items-end mt-64">
          <div className="content bg-black w-full max-w-full border-stone-200 max-h-[45vh]">
            <div className="bg-black text-white p-6 slide-up w-full">
              <div className="flex items-center mb-6">
                <ArrowLeftOutlined className="text-lg mr-4" onClick={closePopup} />
                <h3 className="text-sm font-bold ml-10 ">Import Existing Wallet</h3>
              </div>

              <div className="py-[15px] px-2 flex flex-col gap-[15px] w-full bg-[#080808] rounded-[8px]">
                <button
                  onClick={() => navigate("/recoverseed")}
                  className="flex justify-between w-full items-center"
                  type="default"
                >
                  <div className="flex gap-2.5 items-center">
                    <img src={edit} alt="By Mnemonic Phrase" />
                    <div className="w-full text-start">
                      <p className="pb-0.5 text-white font-urbanist text-[13px] font-[500]">By Mnemonic Phrase</p>
                      <p className="text-[#474747] font-[300] text-[13px] font-urbanist">Use a 12, 0r 24 word seed phrase</p>
                    </div>
                  </div>
                  <img src={righta} alt="Right Arrow" />

                </button>
                <div className="w-full h-[1px] bg-[#161616]"> </div>
                <button
                  onClick={() => navigate("/recover")}
                  className="flex justify-between w-full items-center"
                  type="default"
                >
                  <div className="flex gap-2.5 items-center">
                    <img src={key} alt=" By Private Key" />
                    <div className="w-full text-start">
                      <p className="pb-0.5 text-white font-urbanist text-[13px] font-[500]">By Private key</p>
                      <p className="text-[#474747] font-[300] text-[13px] font-urbanist">Restore with your private key</p>
                    </div>
                  </div>
                  <img src={righta} alt="Right Arrow" />
                </button>
                <div className="w-full h-[1px] bg-[#161616]"> </div>
                <button
                  onClick={() => navigate("/signin")}
                  className="flex justify-between w-full items-center"
                  type="primary"
                >
                  <div className="flex gap-2.5 items-center">
                    <img src={cloud} alt="Restore wallet from Backup" />
                    <div className="w-full text-start">
                      <p className="pb-0.5 text-white font-urbanist text-[13px] font-[500]">Restore wallet from Backup</p>
                      <p className="text-[#474747] font-[300] text-[13px] font-urbanist">Restore wallet from backup</p>
                    </div>
                  </div>
                  <img src={righta} alt="Right Arrow" />
                </button>
                <div className="w-full h-[1px] bg-[#161616]"> </div>
                <button
                  onClick={() => navigate("/watch-wallet")}
                  className="flex justify-between w-full items-center"
                  type="primary"
                >
                  <div className="flex gap-2.5 items-center">
                    <img src={watch} alt="Watch Wallet" />
                    <div className="w-full text-start">
                      <p className="pb-0.5 text-white font-urbanist text-[13px] font-[500]">Watch Wallet</p>
                      <p className="text-[#474747] font-[300] text-[13px] font-urbanist">Track asset of other SOL wallet</p>
                    </div>
                  </div>
                  <img src={righta} alt="Right Arrow" />
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
    </>
  );
}

export default Home;