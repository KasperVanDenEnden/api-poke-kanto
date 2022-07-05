const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemon.controller");


router.get('/storage');
router.put('/train');
router.put('/evolve',);
router.put('/favorite');
router.put('/slot');
router.put('/release');
router.put('/release/mass');

module.exports = router