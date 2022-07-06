const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;
const functions = require("../config/functions");

const getBagByIdQuery = "SELECT bagId FROM trainerBag WHERE trainerId = ?;";

module.exports = {
  getBagById: (req, res, next) => {
    const tokenId = req.tokenId;
    logger.info(tokenId);
    dbconnection.getConnection((err, connection) => {
      if (err) next(err);

      connection.query(getBagByIdQuery, [tokenId], (error, result, fields) => {
        if (error) next(error);

        if (functions.isNotEmpty(result)) {
          const { bagId } = result[0];
          req.bagId = bagId;
          next();
        } else {
          res.status(400).json({
            status: 400,
            message:
              "This trainer lost his bag, is he going to carry all his Poke Balls?",
          });
        }
      });
    });
  },
  getbagInventoryQuery: (req, res, next) => {
    const bagId = req.bagId;
    const { sort } = req.query;

    let getBagInventoryQuery = "SELECT * FROM bag";
    if (bagId || sort) {
      getBagInventoryQuery += " WHERE ";
      if (bagId) {
        getBagInventoryQuery += `bagId = ${bagId}`;
      }

      if (bagId && sort) {
        getBagInventoryQuery += " AND ";
      }

      if (sort) {
        getBagInventoryQuery += `sort = '${sort}'`;
      }
    }
    getBagInventoryQuery += ";";
    req.getBagInventoryQuery = getBagInventoryQuery;
    logger.info(getBagInventoryQuery);
    next();
  },
  getBagInventory: (req, res, next) => {
    const { getBagInventoryQuery } = req;
    dbconnection.getConnection((err, connection) => {
      if (err) next(err);

      connection.query(getBagInventoryQuery, (error, results, fields) => {
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
            message: "According to prof. Oak your bag is empty ",
          });
        }
      });
    });
  },

  sellItemFromBag: (req, res, next) => {},
};
