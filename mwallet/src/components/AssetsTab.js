import React from "react";
import { List, Avatar } from "antd";
import logo from "../noImg.png";
import SOL from "../images/Solana_logo.png";
import USDC from '../images/usdc.png';

function AssetsTab({ tokens }) {
  return (
    <>
      <div className="text-white text-left ml-2 mb-4">My Assets</div>
      {tokens ? (
        <List
          className="text-white"
          bordered
          itemLayout="horizontal"
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
                title={<span style={{ color: "white" }}>{item.symbol}</span>}
                description={<span style={{ color: "gray" }}>{item.name}</span>}
              />
              <div>
                {(Number(item.amountRaw) / 10 ** Number(item.decimals)).toFixed(2)} Tokens
              </div>
            </List.Item>
          )}
        />
      ) : (
        <span>You seem to not have any tokens yet</span>
      )}
    </>
  );
}

export default AssetsTab;
