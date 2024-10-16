import React from "react";
import { List, Avatar } from "antd";
import logo from "../noImg.png";
import SOL from "../images/Solana_logo.png";
import USDC from '../images/usdc.png';

function AssetsTab({ tokens }) {
  console.log(tokens)
  return (
    <>
      <div className="text-white text-left ml-2 mb-4">My Assets</div>
      {tokens?.length != 0 ? (
        tokens.map((item, idx) => <div className="w-full text-white bg-[#080808] flex justify-between items-center py-3 px-2 rounded-[5px]" key={idx}>
          <div className="flex items-center">
            <Avatar
              src={
                item.symbol === "SOL"
                  ? SOL
                  : item.symbol === "USDC"
                    ? USDC
                    : item.logo || logo
              }
            />
            <div className="pl-2 flex flex-col gap-0.5 text-start">
              <span style={{ color: "white" }}>{item.name}</span>
              <span style={{ color: "gray" }}>{item.symbol}</span>
            </div>
          </div>
          <div className="">
            <div className="text-right text-white text-[13px] font-medium font-['Urbanist']">$0</div>
            <div className="text-right text-[#a8a8a8] text-[13px] font-light font-['Urbanist']">+0.78%</div>
          </div>
        </div>)

      ) : (
        <span>You seem to not have any tokens yet</span>
      )}
    </>
  );
}

export default AssetsTab;

/*

<List
          className="text-white bg-[#080808] flex justify-between items-center"
          bordered
          itemLayout=""
          dataSource={tokens}
          renderItem={(item) => (
            <List.Item style={{ textAlign: "left", color: "white" }}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      item.symbol === "SOL"
                        ? SOL
                        : item.symbol === "USDC"
                          ? USDC
                          : item.logo || logo
                    }
                  />
                }
                description={<span style={{ color: "gray" }}>{item.name}</span>}
                title={<span style={{ color: "white" }}>{item.symbol}</span>}
              />
              <div>
                {(Number(item.amountRaw) / 10 ** Number(item.decimals)).toFixed(2)} Tokens
              </div>
            </List.Item>
          )}
        />


*/