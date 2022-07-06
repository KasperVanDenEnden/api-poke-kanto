const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;
const functions = require("../config/functions");
const ot = require("../config/ot");

module.exports = {
  getPokedexQuery: (req, res, next) => {
    logger.info("getPokedex aangeroepen");
    let getPokedexQuery = "SELECT * FROM pokedex";
    const { dexNr, pokemon, type, evolution, limit } = req.query;
    logger.info(dexNr, pokemon, type, evolution, limit);
    if (dexNr || pokemon || type || evolution) {
      getPokedexQuery += " WHERE ";
      if (dexNr) {
        getPokedexQuery += `dexNr = ${dexNr}`;
      }

      if (dexNr && (pokemon || type || evolution)) {
        getPokedexQuery += " AND ";
      }

      if (pokemon) {
        getPokedexQuery += `pokemon LIKE '%${pokemon}%'`;
      }

      if (pokemon && (type || evolution)) {
        getPokedexQuery += " AND ";
      }

      if (type) {
        getPokedexQuery += `type LIKE '%${type}%'`;
      }

      if (type && evolution) {
        getPokedexQuery += " AND ";
      }

      if (evolution) {
        getPokedexQuery += `evolution LIKE '%${evolution}%'`;
      }
    }

    if (limit) {
      getPokedexQuery += ` LIMIT ${limit}`;
    }
    getPokedexQuery += ";";
    req.getPokedexQuery = getPokedexQuery;
    logger.info(getPokedexQuery);
    next();
  },
  getPokedex: (req, res, next) => {
    const { getPokedexQuery } = req;
    dbconnection.getConnection((err, connection) => {
      if (err) next(err);

      connection.query(getPokedexQuery, (error, results, fields) => {
        if (error) next(error);
        connection.release();

        if (functions.isNotEmptyResults(results)) {
          res.status(200).json({
            status: 200,
            results: results,
          });
        } else {
          res.status(201).json({
            status: 201,
            message:
              "According to prof. Oak there exists no Pokèmon to those details. ",
          });
        }
      });
    });
  },
};
