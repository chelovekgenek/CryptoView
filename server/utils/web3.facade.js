const { Web3, HttpProvider } = require("web3");
const config = require("../config");
const { default: axios } = require("axios");
const {
  startsWith,
  sanitizeString,
  isJsonString,
  sanitizeIpfsUri,
} = require("./index");

class Web3Facade {
  constructor() {
    const provider = new HttpProvider(config.web3.providerUrl);
    this.web3 = new Web3(provider);
  }

  async getNFTMetadata(nftCollateralContract, nftCollateralId) {
    const erc721Contract = new this.web3.eth.Contract(
      config.web3.interfaces.erc721.abi,
      nftCollateralContract
    );
    const isErc721 = await erc721Contract.methods
      .supportsInterface(config.web3.interfaces.erc721.name)
      .call();
    console.log("isErc721", isErc721);
    if (isErc721) {
      return this.getErc721Metadata(nftCollateralContract, nftCollateralId);
    }

    const erc1155Contract = new this.web3.eth.Contract(
      config.web3.interfaces.erc1155.abi,
      nftCollateralContract
    );
    const isErc1155 = await erc1155Contract.methods
      .supportsInterface(config.web3.interfaces.erc1155.name)
      .call();
    console.log("isErc1155", isErc1155);
    if (isErc1155) {
      return this.getErc1155Metadata(nftCollateralContract, nftCollateralId);
    }

    return null;
  }

  async getErc721Metadata(nftCollateralContract, nftCollateralId) {
    const contractInstance = new this.web3.eth.Contract(
      config.web3.interfaces.erc721.abi,
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
      config.web3.interfaces.erc1155.abi,
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
    if (startsWith(tokenURI, "http")) {
      try {
        const { data } = await axios.get(tokenURI);
        console.log(tokenURI, data);
        if (typeof data === "string") {
          const sanitizedStr = sanitizeString(data);
          if (isJsonString(sanitizedStr)) {
            return JSON.parse(sanitizedStr);
          }
        }
        return data;
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
    } else if (startsWith(tokenURI, "ipfs")) {
      try {
        const uri = tokenURI.replace("{id}", nftCollateralId);
        const ipfsUrl = sanitizeIpfsUri(uri);
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
