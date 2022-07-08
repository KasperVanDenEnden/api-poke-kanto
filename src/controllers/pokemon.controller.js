const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;
const functions = require("../config/functions");
const ot = require("../config/ot");

const getPokemonFromStorageQuery = 'SELECT * FROM storage WHERE storageId = ? AND pokemon = ? AND lvl = ?';
let putInSlotQuery = "UPDATE trainer SET ";
let checkAlreadyInSlotQuery = 'SELECT trainerId FROM trainer WHERE '
module.exports = {
  getPokedexQuery: (req,res,next) => {
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
  getPokedex: (req,res,next) => {
    const { getPokedexQuery } = req;
    dbconnection.getConnection((err, connection) => {
      if (err) next(err);

      connection.query(getPokedexQuery, (error, results, fields) => {
        if (error) next(error);
        connection.release();

        if (functions.isNotEmptyResults(results)) {
          results.forEach(element => {
            delete element.maxLevelCatch;
            delete element.minLevelCatch;
            delete element.catchRate;
            if (element.evolution === "none") {
              delete element.evolution;
            }

          });

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
  getPokemon: (req,res,next) => {
    const {storageId} = req;
    const {pokemon,lvl,slot} = req.query;
    logger.info("StorageId: "+ storageId);

    dbconnection.getConnection((err,connection) => {
      if (err) next(err);

      connection.query(getPokemonFromStorageQuery,[storageId,pokemon,lvl],(error,result,fields) =>{
        if (error) next(error);
        connection.release();

        if(functions.isNotEmpty(result)) {
          req.putInSlot = result[0];
          req.slot = slot;
          next();
        } else {
          res.status(400).json({
            status:400,
            message:"Can't find the Pokèmon " + pokemon + " with lvl " + lvl,
            info: "You can only put a favorite Pokèmon in your slot!"
          })
        }
      })
    })
  },
  putInSlot: (req,res,next) => {
    const {putInSlot,slot,tokenId} = req;
      if (slot <=6 && slot > 0) {
        const slotPokemon = putInSlot.pokemon + "("+putInSlot.lvl+")";
        const slotString = functions.getSlotString(slot);
        checkAlreadyInSlotQuery += slotString;
        checkAlreadyInSlotQuery += "= ? AND trainerId = ?;";
        logger.info(checkAlreadyInSlotQuery);
        dbconnection.getConnection((err,connection) => {
          if (err) next(err);

            connection.query(checkAlreadyInSlotQuery,[slotPokemon,tokenId],(error,result,fields) => {
              if (error) next(error);

              logger.info("result trainerId " + result[0]);
              if (functions.isNotEmpty(result)) {
                putInSlotQuery += slotString;
                putInSlotQuery += '= ? WHERE trainerId = ?;';

                connection.query(putInSlotQuery,[slotPokemon,tokenId],(error,result,fields) => {
                  if (error) next(error);
                  connection.release();
                    logger.info(result.affectedRows);
                  if (functions.affectedRow(result.affectedRows)) {
                    res.status(200).json({
                      status:200,
                      message: "Your Pokèmon " + slotPokemon + " has been put in slot " + slot 
                    })
                  } else {
                    res.status(401).json({
                      status:400,
                      message: "Your Pokèmon is not eager to go with you on your travels. He stays in storage."
                    })
                  }
                })
              } else {
                connection.release();
                res.status(400).json({
                  status:400,
                  message: "The Pokèmon " + slotPokemon + " is already in slot " + slot
                })
              }
            })
        })
      } else {
        res.status(401).json({
          status:401,
          message: "Slot " + slot + "does not exist! [1-6]"
        })
      }
  },

};
