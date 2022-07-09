const express = require("express");
const router = express.Router();
const catchController = require("../controllers/catch.controller");
const storageController = require("../controllers/storage.controller");
const trainerController = require("../controllers/trainer.controller");
const bagController = require("../controllers/bag.controller");



router.post('/catch/poke',trainerController.validateToken,catchController.locationUnlocked,bagController.getBagById,catchController.pokeBallLeft,catchController.shiny,storageController.getStorage,catchController.getPokemonAndCatchRate,catchController.catchPokeball);
router.post('/catch/great',trainerController.validateToken,catchController.locationUnlocked,bagController.getBagById,catchController.pokeBallLeft,catchController.shiny,storageController.getStorage,catchController.getPokemonAndCatchRate,catchController.catchPokeball);
router.post('/catch/ultra',trainerController.validateToken,catchController.locationUnlocked,bagController.getBagById,catchController.pokeBallLeft,catchController.shiny,storageController.getStorage,catchController.getPokemonAndCatchRate,catchController.catchPokeball);
router.post('/catch/master',trainerController.validateToken,catchController.locationUnlocked,bagController.getBagById,catchController.pokeBallLeft,catchController.shiny,storageController.getStorage,catchController.getPokemonAndCatchRate,catchController.catchPokeball);
router.get('/test',trainerController.validateToken,catchController.locationUnlocked);

module.exports = router