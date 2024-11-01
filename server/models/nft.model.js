const mongoose = require("mongoose");
const Web3 = require("web3");

const { Schema } = mongoose;

const NftMetadataSchema = new Schema({
  name: { type: String, required: true },
  project: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const NftSchema = new Schema(
  {
    nftCollateralContract: { type: String, required: true },
    nftCollateralId: { type: String, required: true },
    metadata: { type: NftMetadataSchema, required: true },
  },
  { timestamps: true }
);

NftSchema.index(
  { nftCollateralContract: 1, nftCollateralId: 1 },
  { unique: true }
);

const NftModel = mongoose.model("Nft", NftSchema);

exports.create = (doc) => {
  doc.nftCollateralContract = Web3.utils.toChecksumAddress(
    doc.nftCollateralContract
  );
  return NftModel.create(doc);
};

exports.findOne = (query) => {
  if (query.nftCollateralContract) {
    query.nftCollateralContract = Web3.utils.toChecksumAddress(
      query.nftCollateralContract
    );
  }
  return NftModel.findOne(query);
};
