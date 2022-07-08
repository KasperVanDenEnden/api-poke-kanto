const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/trainer.controller");
const pokemonController = require("../controllers/pokemon.controller");
const storageController = require("../controllers/storage.controller");

router.get('/trainer',trainerController.validateToken,trainerController.getTrainerCard);
router.post('/login', trainerController.login);
router.post('/trainer/new',trainerController.checkNewTrainer,trainerController.addTrainer);
router.put('/trainer/pwd',trainerController.validateToken ,trainerController.pwdChange);
router.post('/slot',trainerController.validateToken,storageController.getStorage,pokemonController.getPokemon,trainerController.getTrainerSlots,trainerController.putInfirstEmptySlot);
router.put('/slot',trainerController.validateToken,pokemonController.emptySlot);

module.exports = router