const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONG_URI,
  web3: {
    providerUrl: process.env.WEB3_PROVIDER_URL,
    interfaces: {
      erc721: {
        name: "0x80ac58cd",
        abi: [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "tokenURI",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
            ],
            name: "supportsInterface",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
          },
        ],
      },
      erc1155: {
        name: "0xd9b67a26",
        abi: [
          {
            constant: true,
            inputs: [
              {
                internalType: "uint256",
                name: "_id",
                type: "uint256",
              },
            ],
            name: "uri",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
            ],
            name: "supportsInterface",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
          },
        ],
      },
    },
  },
};

module.exports = config;
