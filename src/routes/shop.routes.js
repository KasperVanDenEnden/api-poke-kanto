const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop.controller");
const bagController = require("../controllers/bag.controller");
const trainerController = require("../controllers/trainer.controller");


router.get('/shop',);
router.post('/shop/buy',);
router.post('/shop/sell',);
router.put('/lotery',trainerController.validateToken,shopController.loteryTicketsLeft,shopController.lotery);

module.exports = router