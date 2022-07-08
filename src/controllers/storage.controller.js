const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;
const functions = require("../config/functions");
const { json } = require("body-parser");
const { nextTick } = require("process");

const getStorageIdQuery = "SELECT * FROM trainerStorage WHERE trainerId = ?;"
const getStorageQuery = "SELECT * FROM storage WHERE storageId = ?;"
const massReleaseQuery = "DELETE FROM storage WHERE favorite = 0 AND shiny = 0;"
const moneyReleaseQuery = "UPDATE trainer SET saldo = saldo + ? WHERE trainerId = ?;"

module.exports = {
    getStorage: (req,res,next) => {
        const tokenId = req.tokenId;

        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(getStorageIdQuery,[tokenId],(error,result,fields) => {
                if (error) next(error);
                connection.release();

                const storageId = result[0].storageId;
                if (functions.isNotEmpty(result)) {
                    req.storageId = storageId
                    next();
                } else {
                    res.status(400).json({
                        status:400,
                        message:"Computer unable to find your storage"
                    })
                }

            })
        })
    },
    getStoragePokemon: (req,res,next) => {
        const {storageId} = req;

        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(getStorageQuery,[storageId],(error,results,fields) =>{
                if (error) next(error);
                connection.release();

                if (functions.isNotEmptyResults(results)) {
                    res.status(200).json({
                        status:200,
                        results:results
                    })
                } else {
                    res.status(401).json({
                        status:401,
                        message: "Computer was unable to pull up your storage!"
                    })
                }
            })
        })
    },
    checkFavoriteQuery: (req,res,next) => {
        let checkFavoriteQuery = "SELECT favorite FROM storage WHERE storageId = ? AND favorite = 0";
        const {pokemon, gender, lvl } = req.query;
            if (pokemon || gender || lvl ) {
                checkFavoriteQuery += " AND ";

                if (pokemon) {
                    checkFavoriteQuery += `pokemon = '${pokemon}'`;
                }

                if (pokemon && (gender || lvl)) {
                    checkFavoriteQuery += " AND ";
                }

                if (gender) {
                    checkFavoriteQuery += `gender = '${gender}'`;
                }

                if (gender && lvl) {
                    checkFavoriteQuery += " AND ";
                }
                
                if (lvl) {
                    checkFavoriteQuery += `lvl = ${lvl}`;
                }
            }
        checkFavoriteQuery += ";";
        req.checkFavoriteQuery = checkFavoriteQuery;
        next();
    },
    getFavoriteQuery: (req,res,next) => {
        let favoriteQuery = "UPDATE storage SET favorite = ? WHERE storageId = ?";
        const {pokemon, gender, lvl } = req.query;
            if (pokemon || gender || lvl) {
                favoriteQuery += " AND "
                
                if (pokemon) {
                    favoriteQuery += `pokemon = '${pokemon}'`;
                }

                if (pokemon && (gender || lvl)) {
                    favoriteQuery += " AND ";
                }

                if (gender) {
                    favoriteQuery += `gender = '${gender}'`;
                }

                if (gender && lvl) {
                    favoriteQuery += " AND ";
                }
                
                if (lvl) {
                    favoriteQuery += `lvl = ${lvl}`;
                }
            }
        favoriteQuery += ";";
        req.favoriteQuery = favoriteQuery;
        next();
    },
    favorite: (req,res,next) => {
        const {storageId,favoriteQuery,checkFavoriteQuery} = req;
        const {pokemon, gender, lvl } = req.query;
        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(checkFavoriteQuery,[storageId],(error,result,fields) => {
                if (error) next();

                let favorite;
                if (functions.isNotEmpty(result)) {
                    favorite = 1;

                    connection.query(favoriteQuery,[favorite,storageId],(error,result,fields) => {
                        if (error) next(error);
                        connection.release();

                        if (functions.affectedRow(result.affectedRows)) {
                            res.status(200).json({
                                status: 200,
                                message: "Your Pokèmon " + pokemon + " is now one of your favorite!"
                            })
                        } else {
                            res.status(400).json({
                                status:400,
                                message: "Could not find the Pokèmon you wanted to favorite!"
                            })
                        }
                    })
                } else {
                    favorite = 0;

                    connection.query(favoriteQuery,[favorite,storageId],(error,result,fields) => {
                        if (error) next(error);
                        connection.release();

                        if (functions.affectedRow(result.affectedRows)) {
                            res.status(200).json({
                                status: 200,
                                message: "Your Pokèmon " + pokemon + " is no longer one of your favorite!"
                            })
                        } else {
                            res.status(400).json({
                                status:400,
                                message: "Could not find the Pokèmon you wanted to unfavorite!"
                            })
                        }
                    })
                }
            })
        })
    },
    massRelease: (req,res,next) => {
        const {storageId,tokenId} = req;

        dbconnection.getConnection((err,connection) => {
            if (err) next(err);
            
            connection.query(massReleaseQuery,(error,result,fields) => {
                if (error) next(error);

                if (functions.affectedRows(result.affectedRows)) { 
                    const released = result.affectedRows;
                    const money = 500 * released;
                    
                    
                    connection.query(moneyReleaseQuery,[money,tokenId],(error,result,fields) => {
                        if (error) next(error);
                        connection.release();

                        if (functions.updateSuccesfull(result.info)) {
                            res.status(200).json({
                                status:200,
                                message: "You released " + released + " Pokèmon and " + money + " Pokècoins were added to your balance!"
                            })
                        } else {(
                            res.status(400).json({
                                status:400,
                                message:"While your were leaving a tear for your released Pokèmon, Team Rocket ran away with your money!"
                            })
                        )}
                        res.end();
                    })
                } else {
                    connection.release();
                    res.status(201).json({
                        status:201,
                        message: "Seems you have only Pokèmon left who are your favorite!"
                    })
                }
            })
        })

    },
}
