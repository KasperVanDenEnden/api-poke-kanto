const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;
const functions = require("../config/functions");
const excavates = require("../config/excavates");
const e = require("express");

const getPokemonFromStorageQuery = 'SELECT * FROM storage WHERE storageId = ? AND pokemon = ? AND lvl = ?';
const itemAlreadyInBagQuery = 'SELECT * FROM bag WHERE bagId = ? AND item = ?;';
const putExcavatedInBagQuery = "UPDATE trainer SET quantity = quantity + 1 WHERE item = ? AND bagId = ?;";
const putNewExcavatedInBagQuery = "INSERT INTO bag (bagId,item,sort) VALUES (?,?,?);";

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
  emptySlot: (req,res,next) => {
    const {tokenId} = req;
    const {slot} = req.query;
    const emptySlotQuery = functions.emptySlotQuery(slot);

    dbconnection.getConnection((err,connection) => {
      if (err) next(err);

      connection.query(emptySlotQuery,[tokenId],(error,result,fields) => {
        if (error) next(error);
        connection.release();
        logger.info(result);
        if(functions.updateSuccesfull(result.info)) {
            res.status(200).json({
              status:200,
              message:"Slot " + slot + " is now empty!"
            })          
        } else {
          res.status(400).json({
            status:400,
            message: "Slot " + slot + " was already empty!"
          })
        }
      })
    })
  },
  excavate: (req,res,next) => {
    let dugUp;
    const typeExcavate = Math.floor(Math.random() * 6)
    if (typeExcavate == 0 || typeExcavate == 2 || typeExcavate == 4) {
      res.status(400).json({
        status:400,
        message:"Wall collapsed and you found nothing! Please try again!"
      })
    } else {
      const {bagId} = req;
      if (typeExcavate == 0) {dugUp = excavates.excavateFossil()} 
      if (typeExcavate == 3) {dugUp = excavates.excavateStone()}
      if (typeExcavate == 5) {dugUp = excavates.excavateValuable()}
      const excavated = dugUp[Math.floor(Math.random()*dugUp.length)]
      
      dbconnection.getConnection((err,connection) => {
        if (err) next(err);
        
        logger.info("BAGID" + bagId)
        logger.info("EXCAVATED: " + excavated)
        connection.query(itemAlreadyInBagQuery,[excavated,bagId],(error,result,fields) => {
          if (error) next(error);
          logger.info("LENGTH" + result.length);
          if (result.length === 0) { console. log("Array is empty!") }
          if (!functions.arrayIsEmpty(result)) {
            // update
           
            connection.query(putExcavatedInBagQuery,[excavated,bagId],(error,result,fields) => {
              if (error) next(error);
              connection.release();
              
              if (result) {
                res.status(200).json({
                  status:200,
                  message: "You found the treasure " + excavated + " and put it in your bag!"
                })
              } else {
                  res.status(401).json({
                    status:401,
                    message: "Team Rocket stole your treasue!"
                  })
              }

            })
          } else {
            // insert
            const sort = functions.getExcavatedSort(excavated);

            connection.query(putNewExcavatedInBagQuery,[bagId,excavated,sort],(error,result,fields) => {
              if (error) next(error);
              connection.release();
              
              logger.info(result)
              if (result) {
                res.status(200).json({
                  status:200,
                  message: "You found the treasure " + excavated + " and put it in your bag!"
                })
              } else {
                  res.status(401).json({
                    status:401,
                    message: "Team Rocket stole your treasue!"
                  })
              }

      
            })
          }
        })
      })
    }
  },

}


// putInSlot: (req,res,next) => {
//   const {putInSlot,slot,tokenId} = req;
//     if (slot <=6 && slot > 0) {
//       const slotPokemon = putInSlot.pokemon + "("+putInSlot.lvl+")";

//       dbconnection.getConnection((err,connection) => {
//         if (err) next(err);
//           const checkAlreadyInSlotQuery = functions.checkAlreadyInSlotQuery(slot);

//           connection.query(checkAlreadyInSlotQuery,[slotPokemon,tokenId],(error,result,fields) => {
//             if (error) next(error);

//             if (functions.isNotEmpty(result)) {
              
//               const putInSlotQuery = functions.putInSlotQuery(slot);

//               connection.query(putInSlotQuery,[slotPokemon,tokenId],(error,result,fields) => {
//                 if (error) next(error);
//                 connection.release();
//                   logger.info(result.affectedRows);
//                 if (functions.affectedRow(result.affectedRows)) {
//                   res.status(200).json({
//                     status:200,
//                     message: "Your Pokèmon " + slotPokemon + " has been put in slot " + slot 
//                   })
//                 } else {
//                   res.status(401).json({
//                     status:400,
//                     message: "Your Pokèmon is not eager to go with you on your travels. He stays in storage."
//                   })
//                 }
//               })
//             } else {
//               connection.release();
//               res.status(400).json({
//                 status:400,
//                 message: "The Pokèmon " + slotPokemon + " is already in a slot!"
//               })
//             }
//           })
//       })
//     } else {
//       res.status(401).json({
//         status:401,
//         message: "Slot " + slot + "does not exist! [1-6]"
//       })
//     }
// },