const { Web3, HttpProvider } = require("web3");
const config = require("../config");
const { default: axios } = require("axios");
const { sanitizeString, isJsonString } = require("./web3.helpers");

class Web3Facade {
  constructor() {
    const provider = new HttpProvider(config.web3.providerUrl);
    this.web3 = new Web3(provider);
  }

  async getErc721Metadata(nftCollateralContract, nftCollateralId) {
    const contractInstance = new this.web3.eth.Contract(
      config.web3.ABIs.erc721,
      nftCollateralContract
    );
    const tokenURI = await contractInstance.methods
      .tokenURI(nftCollateralId)
      .call();
    return await this.getNFTMetadataByUri(
      tokenURI,
      nftCollateralContract,
      nftCollateralId
    );
  }

  async getErc1155Metadata(nftCollateralContract, nftCollateralId) {
    const contractInstance = new this.web3.eth.Contract(
      config.web3.ABIs.erc1155,
      nftCollateralContract
    );
    const tokenURI = await contractInstance.methods.uri(nftCollateralId).call();
    return await this.getNFTMetadataByUri(
      tokenURI,
      nftCollateralContract,
      nftCollateralId
    );
  }

  async getNFTMetadataByUri(tokenURI, nftCollateralContract, nftCollateralId) {
    const startsWith = (str) =>
      typeof tokenURI === "string" && tokenURI.substring(0, str.length) === str;
    console.log(tokenURI, nftCollateralContract, nftCollateralId);
    if (startsWith("http")) {
      try {
        const res = await axios.get(tokenURI);
        const sanitizedStr = sanitizeString(res.data);
        if (isJsonString(sanitizedStr)) {
          return JSON.parse(sanitizedStr);
        } else {
          return res.data;
        }
      } catch (err) {
        console.log(
          "[WARN] Error retrieving HTTP metadata",
          nftCollateralContract,
          nftCollateralId,
          {
            error: JSON.stringify(err),
          }
        );
      }
    } else if (startsWith("ipfs")) {
      let [, uri] = tokenURI.split("ipfs://");
      try {
        uri = uri.replace("ipfs/", "");
        const ipfsUrl = `https://ipfs.io/ipfs/${uri}`;
        const result = await axios.get(ipfsUrl);
        return result.data;
      } catch (err) {
        console.log(
          "[WARN] Error retrieving IPFS metadata",
          nftCollateralContract,
          nftCollateralId,
          {
            error: JSON.stringify(err),
          }
        );
      }
    } else if (isJsonString(tokenURI)) {
      return JSON.parse(tokenURI);
    }
  }
}

module.exports = new Web3Facade();
