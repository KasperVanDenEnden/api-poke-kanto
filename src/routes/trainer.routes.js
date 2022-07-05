const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/trainer.controller");

router.get('/trainer',);
router.post('/login', trainerController.login);
router.post('/trainer/new',trainerController.checkNewTrainer,trainerController.addTrainer);
router.put('/trainer/pwd',trainerController.validateToken ,trainerController.pwdChange);

module.exports = router