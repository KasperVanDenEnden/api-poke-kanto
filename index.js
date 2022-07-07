const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
require('dotenv').config()
const port = process.env.PORT
const logger = require("./src/config/config").logger;


// routers
const shopRouter = require('./src/routes/shop.routes')
const bagRouter = require('./src/routes/bag.routes')
const catchRouter = require('./src/routes/catch.routes')
const pokemonRouter = require('./src/routes/pokemon.routes')
const trainerRouter = require('./src/routes/trainer.routes')
const storageRouter = require('./src/routes/storage.routes')

app.all("*", (req, res, next) => {
    const method = req.method;
    logger.info(`Methode ${method} angeroepen`);
    next();
  });


  // bag routes
  app.use(bagRouter);
  // catch routes
  app.use(catchRouter);
  // shop routes
  app.use(shopRouter);
  // pokemon routes
  app.use(pokemonRouter);
  //trainer routes
  app.use(trainerRouter);
  //storage routes
  app.use(storageRouter);

  // not found End-point
app.all("*", (req, res) => {
    res.status(404).json({
      status: 404,
      result: "End-point not found",
    });
  });
  
  // Error handler
  app.use((err, req, res, next) => {
    res.status(err.status).json(err)
  })
  
  app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`);
  });
  
  module.exports = app;
