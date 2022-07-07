const express = require("express");
const router = express.Router();
const storageController = require("../controllers/storage.controller");
const trainerController = require("../controllers/trainer.controller");

router.get('/storage',trainerController.validateToken,storageController.getStorage,storageController.getStoragePokemon);
router.put('/release');
router.put('/release/mass',trainerController.validateToken,storageController.getStorage,storageController.massRelease);

module.exports = router