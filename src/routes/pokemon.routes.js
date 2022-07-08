const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemon.controller");
const storageController = require("../controllers/storage.controller");
const trainerController = require("../controllers/trainer.controller");



router.get('/pokedex',trainerController.validateToken,pokemonController.getPokedexQuery,pokemonController.getPokedex);

router.put('/train');
router.put('/evolve',);
router.put('/slot',trainerController.validateToken,storageController.getStorage,pokemonController.getPokemon,pokemonController.putInSlot);


module.exports = router