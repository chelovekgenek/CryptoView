const Web3Validator = require("web3-validator");
const Web3Facade = require("../utils/web3.facade");
const NftModel = require("../models/nft.model");

const getMetadata = async (req, res) => {
  const { contract, id } = req.params;

  if (!Web3Validator.isAddress(contract, false)) {
    return res.status(400).json({ message: "Invalid contract address" });
  }

  if (isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const nft = await NftModel.findOne({
    nftCollateralContract: contract,
    nftCollateralId: id,
  });
  if (nft) return res.status(200).json(toDto(nft));

  let metadata;
  try {
    metadata = await Web3Facade.getErc721Metadata(
      req.params.contract,
      req.params.id
    );
  } catch (err) {
    console.error("[ERROR] getMetadata failure", err);
  }

  if (!metadata) return res.status(404).json({ message: "NFT not found" });

  const result = await NftModel.create({
    nftCollateralContract: contract,
    nftCollateralId: id,
    metadata: {
      name: metadata.name,
      project: metadata.projectName,
      description: metadata.description,
      image: metadata.imageUrl,
    },
  });

  res.status(200).json(toDto(result));
};

const toDto = (nft) => ({
  contract: nft.nftCollateralContract,
  id: nft.nftCollateralId,
  metadata: {
    name: nft.metadata.name,
    description: nft.metadata.description,
    image: nft.metadata.image,
  },
});

module.exports = { getMetadata };
