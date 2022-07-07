const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;
const functions = require("../config/functions");

const catchedPokemonQuery = "INSERT INTO storage (storageId,pokemon,lvl,gender) VALUES (?,?,?,?);";
const catchedShinyPokemonQuery = "INSERT INTO storage (storageId,pokemon,lvl,gender,shiny) VALUES (?,?,?,?,1);"
const getPokemonByDexNrQuery = "SELECT * FROM pokedex WHERE dexNr = ?;"
const itemsLeft = "SELECT quantity FROM bag WHERE bagId = ? AND item = ?;"

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

            const randomDexNr = functions.randomDexNr();
           

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
        dbconnection.getConnection((err,connection) => {
            if (err) throw err

            connection.query(itemsLeft,[bagId,"Poke Ball"],(error,result,fields) => {
                if (error) throw error;
                connection.release();
                const {quantity} = result[0];
                if (quantity > 0) {
                    req.itemLeft = quantity -1;
                    next();
                } else {
                    res.status(400).json({
                        status:400,
                        message: "No more Poke Balls left in your inventory"
                    })
                }
                
            })
        })
    },
    greatBallLeft: (req,res,next) => {
        const {bagId} = req;
        dbconnection.getConnection((err,connection) => {
            if (err) throw err

            connection.query(itemsLeft,[bagId,"Great Ball"],(error,result,fields) => {
                if (error) throw error;
                connection.release();
                const {quantity} = result[0];
                if (quantity > 0) {
                    req.itemLeft = quantity -1;
                    next();
                } else {
                    res.status(400).json({
                        status:400,
                        message: "No more Great Balls left in your inventory"
                    })
                }
                
            })
        })
    },
    ultraBallLeft: (req,res,next) => {
        const {bagId} = req;
        dbconnection.getConnection((err,connection) => {
            if (err) throw err

            connection.query(itemsLeft,[bagId,"Ultra Ball"],(error,result,fields) => {
                if (error) throw error;
                connection.release();
                const {quantity} = result[0];
                if (quantity > 0) {
                    req.itemLeft = quantity -1;
                    next();
                } else {
                    res.status(400).json({
                        status:400,
                        message: "No more Ultra Balls left in your inventory"
                    })
                }
                
            })
        })
    },
    masterBallLeft: (req,res,next) => {
        const {bagId} = req;
        dbconnection.getConnection((err,connection) => {
            if (err) throw err

            connection.query(itemsLeft,[bagId,"Master Ball"],(error,result,fields) => {
                if (error) throw error;
                connection.release();
                const {quantity} = result[0];
                if (quantity > 0) {
                    req.itemLeft = quantity -1;
                    next();
                } else {
                    res.status(400).json({
                        status:400,
                        message: "No more Master Balls left in your inventory"
                    })
                }
                
            })
        })
    },
    catchPokeball: (req,res,next) => {
        const {catchedQuery,shinyBool,storageId,bagId,itemLeft} = req;
        const {dexNr,pokemon,type,minLevelCatch,maxLevelCatch,catchRate} = req.pokemon;
        const catchBool = functions.catchPokeball(catchRate);
        let level = Math.floor(Math.random() * (maxLevelCatch - minLevelCatch + minLevelCatch) + minLevelCatch);
        const gender = functions.maleOrFemale(pokemon);
        functions.threwBall(bagId, req.originalUrl);
   
    
        if (catchBool) {
            let caughtPokemon = functions.caughtPokemon(dexNr,pokemon,type,level,gender,shinyBool);
            
         
            dbconnection.getConnection((err,connection) => {
                if (err) next(err);
               
                connection.query(catchedQuery,[storageId,pokemon,level,gender],(error,result,fields) => {
                    if (error) next(error);
                    connection.release();
              
                    
                    if (functions.affectedRow(result.affectedRows)) {
                        res.status(200).json({
                            status:200,
                            message: "You caught the Pokèmon " + pokemon + "("+ gender+") on level "+ level + "!",
                            info: "You have " + itemLeft + " Poke Balls left.",
                            result: caughtPokemon
                        })
                    } else {
                        res.status(201).json({
                            status:201,
                            message: "You caught the Pokèmon " + pokemon + ", but Team Rocket swooped by with an EMP!",
                            info: "You have " + itemLeft + " Poke Balls left."
                        })
                    }

                })
               
            })

        } else {
            res.status(201).json({
                status:201,
                message: "You found the Pokèmon " + pokemon + "("+ gender+"), but it ran away!",
                info: "You have " + itemLeft + " Poke Balls left."
            })
        }
    },
    catchGreatball: (req,res,next) => {
     
    },
    catchUltraball: (req,res,next) => {
       
    },
    catchmasterball: (req,res,next) => {
       
    },
    
    


}  