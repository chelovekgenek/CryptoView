const express = require("express");
const nftController = require("../controllers/nftsController.js");

const router = express.Router();

// GET nft metadata by contract and id
router.get("/:contract/:id", nftController.getMetadata);

module.exports = router;
