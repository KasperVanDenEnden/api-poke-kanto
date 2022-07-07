const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;
const functions = require("../config/functions");

const getBagByIdQuery = 'SELECT bagId FROM trainerBag WHERE trainerId = ?;'
const itemNotInBagYetQuery = 'SELECT * FROM bag WHERE bagId = ? AND item = ?;'
const newItemInBagQuery = 'INSERT INTO bag (bagId,item,quantity,sort) VALUES (?,?,?,?);'
const getItemQuery = 'SELECT * FROM item WHERE item = ?;'
const saldoCheckQuery = 'SELECT * FROM trainer WHERE trainerId = ? AND saldo >= ?;'

// shop queries
const getShopInventoryQuery = "SELECT * FROM item;"
const receiveMoneyItemQuery = "UPDATE trainer SET saldo = saldo + ? WHERE trainerId = ?;"
const giveMoneyItemQuery = "UPDATE trainer SET saldo = saldo - ? WHERE trainerId = ?;"
const checkSellItemQuery = "SELECT * FROM bag WHERE bagId = ? AND item = ? AND quantity >=?;"
const sellItemToShopQuery = "UPDATE bag SET quantity = quantity - ? WHERE bagId = ? AND item = ?;"
const buyItemQuery = "UPDATE bag SET quantity = quantity + ? WHERE bagId = ? AND item = ?;"
const getItemValuesQuery = "SELECT * FROM item WHERE item = ?;"
const newItemBoughtQuery = "INSERT INTO bag (bagId,item,quantity,sort) VALUES (?,?,?,?);"


// lotery queries
const checkIfTicketHasBeenDrawnTodayQuery = 'SELECT * FROM lotery WHERE trainerId = ? AND day = CURDATE();';
const loteryGivePrizeQuery = 'UPDATE bag SET quantity = quantity + ? WHERE item = ? AND bagId = ?;';
const firstTicketOfTheDayQuery = 'INSERT INTO lotery (trainerId,day) VALUES (?,CURDATE());'
const anotherTicketOfTheDayQuery = 'UPDATE lotery SET tickets = tickets + 1 WHERE trainerId = ? AND day = CURDATE();';


module.exports = { 
    
    getShopInventory: (req,res,next) => {
        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(getShopInventoryQuery,(error,results,fields) => {
                if (error) next(error);
                connection.release();

                if (functions.isNotEmptyResults(results)) {
                    res.status(200).json({
                        status:200,
                        results:results
                    })
                } else {
                    res.status(201).json({
                        status:201,
                        message:"The shop has to restock, apologies for the inconvenience!"
                    })
                }
            })
        })
    },
    buyItemFromShop: (req,res,next) => {
        const {item,quantity} = req.body;
        const {bagId} = req;

        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(itemNotInBagYetQuery,[bagId,item],(error,result,fields) => {
                if (error) next(error);

                if (!functions.isNotEmpty(result)) {

                    connection.query(getItemQuery,[item],(error,result,fields) => {
                        if (error) next(error);

                        const sort = result[0].sort;
                        if (sort)  {
                            connection.query(newItemBoughtQuery,[bagId,item,quantity,sort],(error,result,fields) =>{
                                if (error) next(error);
                                connection.release();

                                if (functions.affectedRow(result)) {
                                    next();
                                } else {
                                    res.status(401).json({
                                        status: 401,
                                        message: "You offended the clerk and he will not let you buy the thing you wanted!"
                                    })
                                }
                            })
                        } else {
                            connection.release();
                            res.status(400).json({
                                status: 400,
                                message: "Can't find item sort"
                            })
                        }                  
                    })
                } else {
                    connection.query(buyItemQuery,[quantity,bagId,item],(error,result,fields) =>{
                        if (error) next(error);
                        connection.release();

                        if (functions.updateSuccesfull(result.info)) {
                            next();
                        } else {
                            res.status(401).json({
                                status: 401,
                                message: "You offended the clerk and he will not let you buy the thing you wanted!"
                            })
                        }
                    })
                }
            })
        })
    },
    sellItemFromBag: (req, res, next) => {
        const {item,quantity} = req.body;
        const {bagId} = req;
    
        dbconnection.getConnection((err,connection) => {
            if (err) next(err);
    
                connection.query(checkSellItemQuery,[bagId,item,quantity],(error,result,fields) =>{
                    if (error) next(error);

                    if (functions.isNotEmpty(result)) {
                        connection.query(sellItemToShopQuery, [quantity,bagId,item],(error,result,fields) => {
                            if (error) next(error);
                            connection.release();
                            if (functions.updateSuccesfull(result.info)) {
                            next();
                            } else {
                            res.status(401).json({
                                status:401,
                                message: "The clerk was not able to buy your goods. Please make sure you are trying to sell the right item and quantity."
                            })
                            }
                        })
                    } else {
                        connection.release();
                        res.status(400).json({
                            status:400,
                            message:"Clerk: You are trying to sell more than you own...."
                        })
                    }
                }) 
        })
    },
    receiveMoneyItem: (req,res,next) => {
        const {item,quantity} = req.body;
        const {tokenId} = req;
        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(getItemValuesQuery,[item],(error,result,fields) => {
                if (error) next(error);

                if (functions.isNotEmpty(result)) {
                    const sellValue = result[0].sellValue;
                    const saldo = sellValue * quantity;
               
                    connection.query(receiveMoneyItemQuery,[saldo,tokenId],(error,result,fields) => {
                        if (error) next(error);
                        connection.release();
                       
                        if (functions.updateSuccesfull(result.info)) {
                            res.status(200).json({
                                status:200,
                                message: "The clerk has wired the " + saldo + " Pokecoins to your account!"
                            })
                        } else {
                            res.status(404).json({
                                status:404,
                                message: "Team Rocket planted a virus, they intercepted the payment and stole your money to fund their evil deeds!"
                            })
                        }
                    })
                } else {
                    connection.release();
                    res.status(400).json({
                        status:400,
                        message: "Clerk seems to have misplaced the list with prices."
                    })
                }
            })
        })
    },
    giveMoneyItem: (req,res,next) => {
        const {item,quantity} = req.body;
        const {tokenId,bagId} = req;

        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(getItemValuesQuery,[item],(error,result,fields) => {
                if (error) next(error);

                if (functions.isNotEmpty(result)) {
                    const buyValue = result[0].buyValue;
                    const saldo = buyValue * quantity;
                    
                    // Check Enough saldo
                    connection.query(saldoCheckQuery,[tokenId,saldo],(error,result,fields) => {
                        if (error) next(error);
                        
                        if (functions.isNotEmpty(result)) {
                            connection.query(giveMoneyItemQuery,[saldo,tokenId],(error,result,fields) => {
                                if (error) next(error);
                                connection.release();
                            
                                if (functions.updateSuccesfull(result.info)) {
                                    res.status(200).json({
                                        status:200,
                                        message: "You wired the " + saldo + " Pokecoins from your account to the shop!"
                                    })
                                } else {
                                    res.status(404).json({
                                        status:404,
                                        message: "Your bank seems to be offline..."
                                    })
                                }
                            })
                        } else {
                            connection.query(sellItemToShopQuery,[quantity,bagId,item],(error,result,fields) => {
                                if (error) next(error);
                                connection.release();
                                if (functions.affectedRow(result.affectedRows)) {
                                    res.status(201).json({
                                        status: 201,
                                        message: "You seem to be low on cash"
                                    })
                                } else {
                                    res.status(402).json({
                                        status: 402,
                                        message: "You took a page out of Team Rockets book and rand of with the goods!"
                                    })
                                }
                            })
                        }
                    })
                } else {
                    connection.release();
                    res.status(400).json({
                        status:400,
                        message: "Clerk seems to have misplaced the list with prices."
                    })
                }
            })
        })
    },
    loteryTicketsLeft: (req,res,next) => { 
        const tokenId = req.tokenId;
        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(checkIfTicketHasBeenDrawnTodayQuery, [tokenId], (error,result,fields) => {
                if (error) next(error);
                
                const {trainerId,tickets} = result[0];
                if (parseInt(tickets) < 10) {
                    if (trainerId === tokenId) {
                        connection.query(anotherTicketOfTheDayQuery,[tokenId], (error,result,fields) => {
                            if (error) next(error);
                            connection.release();
                            const affectedRow = result.affectedRows;
                            logger.error(affectedRow);
                            if (functions.affectedRow(affectedRow)) {
                      
                                next();
                            } else {
                                res.status(401).json({
                                    status:401,
                                    message: 'Oh no your ticket got stolen. Luckily it got caugth in 4K and you will receive a free one on the house. Please draw again!'
                                })
                            }
                        })
                    } else {
                        connection.query(firstTicketOfTheDayQuery, [tokenId], (error,result,fields) =>{
                            if (error) next(error);
                            connection.release();
                            next();
                        })
                    }
                } else {
                        connection.release();
                        res.status(401).json({
                            status:401,
                            message: 'You already got 10 tickets today! Come back tomorrow!'
                        })
                }
            })
        })
    },
    lotery: (req,res,next) => {
        const tokenId = req.tokenId;
        const ticket = functions.getRandom6Digits();
        const matches = functions.getTicketMatchingNumbers(ticket,tokenId);
        let message = functions.getLoteryMessage(matches);
      
        if (matches > 0) {
            const prize = functions.getLoteryPrize(matches);
            const quantity = functions.getLoteryPrizeQuantity(matches);
            const itemType = functions.getItemType(prize);

            dbconnection.getConnection((err,connection) =>{
                if (err) next(err);

                if (itemType === "Coins") {
                    connection.query(receiveMoneyItemQuery,[quantity,tokenId], (error,result,fields) => {
                        if (error) next(error);
                        connection.release();
                        if (result.affectedRows === 1) {
                            message += " Your prize of " + quantity + " " + prize + " has been added to your account!";
                            res.status(200).json({
                                status:200,
                                message: message
                            })
                        } else {
                            message += " Team Rocket appeared and stole your prize of " + quantity + " " + prize + ". Tough luck!";
                            res.status(401).json({
                                status: 401,
                                message: message
                            })
                        }
                    })

                } else {

                    connection.query(getBagByIdQuery,[tokenId],(error,result,fields)=>{
                        if (error) next(error);

                        const bagId = result.bagId;
                        
                        connection.query(itemNotInBagYetQuery,[bagId,prize], (error,result,fields) => {
                            if (error) next(error);

                            if (functions.isNotEmpty(result)) {

                                connection.query(loteryGivePrizeQuery,[quantity,bagId,prize], (error,result,fields) => {
                                    if (error) next(error);
                                    connection.release();

                                    if (functions.updateSuccesfull(result)) {
                                        message += " Your prize of " + quantity + " " + prize + " has been added to your inventory!";
                                        res.status(200).json({
                                            status:200,
                                            message: message
                                        })
                                    } else {
                                        message += " Team Rocket appeared and stole your prizeof " + quantity + " " + prize + ". Tough luck!";
                                        res.status(401).json({
                                            status: 401,
                                            message: message
                                        })
                                    }
                                })
                            } else {

                                connection.query(newItemInBagQuery,[bagId,prize,quantity,itemType], (error,result,fields) => {
                                    if (error) next(error);
                                    connection.release();
                                    if (functions.affectedRow(result)) {
                                        message += " Your prize of " + quantity + " " + prize + " has been added to your inventory!";
                                        res.status(200).json({
                                            status:200,
                                            message: message
                                        })
                                    } else {
                                        logger.info("CHECK 19");
                                        message += " Team Rocket appeared and stole your prize of " + quantity + " " + prize + ". Tough luck!";
                                        res.status(401).json({
                                            status: 401,
                                            message: message
                                        })
                                        res.end();
                                    }
                                    logger.info("CHECK 1");
                                })
                            }
                            logger.info("CHECK 2");
                        })
                        logger.info("CHECK 3");
                    })
                    logger.info("CHECK 4");
                }
                logger.info("CHECK 5");
            }) 
            logger.info("CHECK 6");
        } else {
            logger.info("CHECK 7");
         

            res.status(400).json({
                status:400,
                message: message
            })
            logger.info("CHECK 8");
        }
        logger.info("CHECK 9");
    },
    

}    
