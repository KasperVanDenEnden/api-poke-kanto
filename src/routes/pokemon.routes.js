const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemon.controller");
const trainerController = require("../controllers/trainer.controller");



router.get('/pokedex',trainerController.validateToken,pokemonController.getPokedexQuery,pokemonController.getPokedex);

router.put('/train');
router.put('/evolve',);


module.exports = router