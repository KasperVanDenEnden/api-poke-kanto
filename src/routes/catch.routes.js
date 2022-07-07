const express = require("express");
const router = express.Router();
const catchController = require("../controllers/catch.controller");
const storageController = require("../controllers/storage.controller");
const trainerController = require("../controllers/trainer.controller");
const bagController = require("../controllers/bag.controller");



router.get('/catch/poke',trainerController.validateToken,bagController.getBagById,catchController.pokeBallLeft,catchController.shiny,storageController.getStorage,catchController.getPokemonAndCatchRate,catchController.catchPokeball);
router.get('/catch/great',);
router.get('/catch/ultra',);
router.get('/catch/master',);


module.exports = router