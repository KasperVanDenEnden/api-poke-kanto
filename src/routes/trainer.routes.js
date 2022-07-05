const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/trainer.controller");


router.get('/trainer/login', trainerController.login);
router.post('/trainer/new',);
router.post('/trainer/profile',);

module.exports = router