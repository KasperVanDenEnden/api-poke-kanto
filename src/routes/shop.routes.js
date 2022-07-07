const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop.controller");
const bagController = require("../controllers/bag.controller");
const trainerController = require("../controllers/trainer.controller");


router.get('/shop',trainerController.validateToken,shopController.getShopInventory);
router.put('/shop/buy',trainerController.validateToken,bagController.getBagById,shopController.buyItemFromShop,shopController.giveMoneyItem);
router.put('/shop/sell',trainerController.validateToken,bagController.getBagById,shopController.sellItemFromBag,shopController.receiveMoneyItem);
router.put('/lotery',trainerController.validateToken,shopController.loteryTicketsLeft,shopController.lotery);

module.exports = router