const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;
const functions = require("../config/functions");

const catchedPokemonQuery = "INSERT INTO storage (storageId,pokemon,lvl,gender,ot) VALUES (?,?,?,?,?);";
const catchedShinyPokemonQuery = "INSERT INTO storage (storageId,pokemon,lvl,gender,ot,shiny) VALUES (?,?,?,?,?,1);"
const getPokemonByDexNrQuery = "SELECT * FROM pokedex WHERE dexNr = ?;"
const itemsLeft = "SELECT quantity FROM bag WHERE bagId = ? AND item = ? AND quantity > 0;"

module.exports = { 
    shiny: (req,res,next) => {
        const shinyBool = functions.shiny();
        let catchedQuery = "";
        if (shinyBool) {
            catchedQuery += catchedShinyPokemonQuery;
        } else {
            catchedQuery += catchedPokemonQuery;
        }
        req.shinyBool = shinyBool;
        req.catchedQuery = catchedQuery;
        next();
    },
    getPokemonAndCatchRate: (req,res,next) => {
        dbconnection.getConnection((err,connection) => {
            if (err) next(err);
            let randomDexNr;
            if (functions.ballString(req.originalUrl) === "Master Ball") {
                randomDexNr = functions.randomLegendaryDexNr;
            } else {
                randomDexNr = functions.randomDexNr();
            }         

            connection.query(getPokemonByDexNrQuery,[randomDexNr],(error,result,fields) => {
                if (error) next(error);
                connection.release();

                if (functions.isNotEmpty(result)) {
                    req.pokemon = result[0];
                    next();
                } else {
                    res.status(401).json({
                        status:401,
                        message: "The wilds seem to be peacefull right now. Look again!"
                    })
                }
            })
        })
    },
    pokeBallLeft: (req,res,next) => {
        const {bagId} = req;
        const item = (functions.ballString(req.originalUrl));
        dbconnection.getConnection((err,connection) => {
            if (err) throw err

            connection.query(itemsLeft,[bagId,item],(error,result,fields) => {
                if (error) throw error;
                connection.release();
             
                if (functions.isNotEmpty(result)) {
                    const {quantity} = result[0];
                    req.itemLeft = quantity -1;
                    next();
                } else {
                    res.status(400).json({
                        status:400,
                        message: "No more " + item + " left in your inventory"
                    })
                }
            })
        })
    },
    catchPokeball: (req,res,next) => {
        const {catchedQuery,shinyBool,storageId,bagId,itemLeft,trainer} = req;
        const {dexNr,pokemon,type,minLevelCatch,maxLevelCatch,catchRate} = req.pokemon;
        const catchBool = functions.catchPokeball(catchRate);
        let level = Math.floor(Math.random() * (maxLevelCatch - minLevelCatch + minLevelCatch) + minLevelCatch);
        const gender = functions.maleOrFemale(pokemon);
        functions.threwBall(bagId, req.originalUrl);
        const ballString = (functions.ballString(req.originalUrl));
    
        if (catchBool) {
            let caughtPokemon = functions.caughtPokemon(dexNr,pokemon,type,level,gender,shinyBool,trainer);
            logger.info(caughtPokemon);
            
            dbconnection.getConnection((err,connection) => {
                if (err) next(err);
               
                connection.query(catchedQuery,[storageId,pokemon,level,gender,trainer],(error,result,fields) => {
                    if (error) next(error);
                    connection.release();
                    
                    if (functions.affectedRow(result.affectedRows)) {
                        res.status(200).json({
                            status:200,
                            message: "You caught the Pokèmon " + pokemon + "("+ gender+") on level "+ level + "!",
                            info: "You have " + itemLeft + " " + ballString + " left.",
                            result: caughtPokemon
                        })
                    } else {
                        res.status(201).json({
                            status:201,
                            message: "You caught the Pokèmon " + pokemon + ", but Team Rocket swooped by with an EMP!",
                            info: "You have " + itemLeft + " " + ballString + " left."
                        })
                    }

                })
               
            })

        } else {
            res.status(201).json({
                status:201,
                message: "You found the Pokèmon " + pokemon + "("+ gender+"), but it ran away!",
                info: "You have " + itemLeft + " " + ballString + " left."
            })
        }
    },
    
    


}  