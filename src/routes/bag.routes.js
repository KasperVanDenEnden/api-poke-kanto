const express = require("express");
const router = express.Router();
const bagController = require("../controllers/bag.controller");
const trainerController = require("../controllers/trainer.controller")

router.get('/bag',trainerController.validateToken,bagController.getBagById,bagController.getbagInventoryQuery,bagController.getBagInventory);


module.exports = router