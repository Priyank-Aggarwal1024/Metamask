import React from 'react';
import asset from '../images/asset.svg'
import assetfill from '../images/assetfill.svg'
import transactionImg from '../images/transaction.svg'
import filltransactionImg from '../images/filltransaction.svg'
import swap3 from "../images/swap3.svg";
import fillswap from "../images/fillswap.svg";
import sendb from '../images/sendb.svg'
import recieveb from '../images/recieveb.svg'
function BottomNav({ tab, setTab }) {
    return (
        <div className="flex items-center justify-center px-4 w-full border-t-[1px] border-[#1D1D1D] gap-[35px] py-6 mt-auto sticky bottom-0 z-[10] bg-black">
            {
                tab === 4 ? <img src={assetfill} alt={"Assets"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(4)} /> : <img src={asset} alt={"Assets"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(4)} />
            }
            {tab === 5 ? <img src={filltransactionImg} alt={"Transaction"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(5)} /> : <img src={transactionImg} alt={"Transaction"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(5)} />}
            {
                tab === 3 ? <img src={fillswap} alt={"Swap"} className="w-[25px] h-[25px] cursor-pointer" onClick={() => setTab(3)} /> : <img src={swap3} alt={"Swap"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(3)} />
            }
            <img src={sendb} alt={"Send"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(1)} />
            <img src={recieveb} alt={"Recieve"} className="w-[32px] h-[32px] cursor-pointer bottomsvg" onClick={() => setTab(6)} />
        </div>
    );
}

export default BottomNav;