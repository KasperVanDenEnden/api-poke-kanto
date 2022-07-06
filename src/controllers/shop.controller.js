const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;
const functions = require("../config/functions");

const getBagByIdQuery = 'SELECT bagId FROM trainerBag WHERE trainerId = ?;'
const itemNotInBagYetQuery = 'SELECT * FROM bag WHERE bagId = ? AND item = ?;'
const newItemInBagQuery = 'INSERT INTO bag (trainerId,item,quantity,type) VALUES (?,?,?,?);'

// lotery queries
const checkIfTicketHasBeenDrawnTodayQuery = 'SELECT * FROM lotery WHERE trainerId = ? AND day = CURDATE();';
const loteryGivePrizeQuery = 'UPDATE bag SET quantity = quantity + ? WHERE item = ? AND bagId = ?;';
const firstTicketOfTheDayQuery = 'INSERT INTO lotery (trainerId,day) VALUES (?,CURDATE());'
const anotherTicketOfTheDayQuery = 'UPDATE lotery SET tickets = tickets + 1 WHERE trainerId = ? AND day = CURDATE();';


module.exports = { 
    
    getShopInventory: (req,res,next) => {

    },
    buyItemFromShop: (req,res,next) => {

    },
    loteryTicketsLeft: (req,res,next) => { 
        const tokenId = req.tokenId;
        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(checkIfTicketHasBeenDrawnTodayQuery, [tokenId], (error,result,fields) => {
                if (error) next(error);
                // Object Object???
                const {trainerId,tickets} = result[0];
               
                if (parseInt(tickets) < 10) {
                    if (trainerId === tokenId) {

                        connection.query(anotherTicketOfTheDayQuery,[tokenId], (error,result,fields) => {
                            if (error) next(error);
                            connection.release();
                            
                            const affectedRow = result.affectedRows;
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
        const message = functions.getLoteryMessage(matches);
        logger.info("Matches = " + matches);
        if (matches > 0) {
            const prize = functions.getLoteryPrize(matches);
            const quantity = functions.getLoteryPrizeQuantity(matches);
            const itemType = functions.getItemType(prize);

            logger.info("Itemtype = " + itemType);

            dbconnection.getConnection((err,connection) =>{
                if (err) next(err);

                if (itemType === "Coins") {

                    connection.query(prizeMoneyQuery,[quantity,tokenId], (error,result,fields) => {
                        if (error) next(error);

                        if (result.affectedRows === 1) {
                            message += "Your prize of " + quantity + " " + prize + " has been added to your account!";
                            res.status(200).json({
                                status:200,
                                message: message
                            })
                        } else {
                            message += "Team Rocket appeared and stole your prize of " + quantity + " " + prize + ". Tough luck!";
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

                            if (isNotEmpty(result)) {
                                connection.query(loteryGivePrizeQuery,[quantity,bagId,prize], (error,result,fields) => {
                                    if (error) next(error);
                                    connection.release();

                                    if (functions.updateSuccesfull(result)) {
                                        message += "Your prize of " + quantity + " " + prize + " has been added to your inventory!";
                                        res.status(200).json({
                                            status:200,
                                            message: message
                                        })
                                    } else {
                                        message += "Team Rocket appeared and stole your prizeof " + quantity + " " + prize + ". Tough luck!";
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

                                    if (result.affectedRows === 1) {
                                        message += "Your prize of " + quantity + " " + prize + " has been added to your inventory!";
                                        res.status(200).json({
                                            status:200,
                                            message: message
                                        })
                                    } else {
                                        message += "Team Rocket appeared and stole your prize of " + quantity + " " + prize + ". Tough luck!";
                                        res.status(401).json({
                                            status: 401,
                                            message: message
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
            }) 
        } else {
            res.status(400).json({
                status:400,
                message: message
            })
        }
        

       
    },
    

}    
