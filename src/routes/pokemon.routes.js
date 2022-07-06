const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemon.controller");
const trainerController = require("../controllers/trainer.controller");


router.get('/pokedex',trainerController.validateToken,pokemonController.getPokedexQuery,pokemonController.getPokedex);
router.get('/storage');
router.put('/train');
router.put('/evolve',);
router.put('/favorite');
router.put('/slot');
router.put('/release');
router.put('/release/mass');

module.exports = router