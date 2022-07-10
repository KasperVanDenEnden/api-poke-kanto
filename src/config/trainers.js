const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { nextTick } = require("process");
const logger = require("./config").logger;

const addTrainerExpQuery = "UPDATE trainer SET experience = experience + ? WHERE trainerId = ?;";
const trainerLvlUpQuery = "UPDATE trainer SET trainerLvl = trainerLvl + 1 WHERE trainerId = ?;";
const getTrainerQuery = "SELECT * FROM trainer WHERE trainerId = ?;";

module.exports = {
    addTrainerExp(trainerId) {
        const exp = 10;
        
        dbconnection.getConnection((err,connection) => {
            if (err) throw err

            connection.query(addTrainerExpQuery,[exp,trainerId],(error,result,fields) => {
                if (error) throw error;
                
                connection.query(getTrainerQuery,[trainerId],(error,result,fields) => {
                    if (error) throw error;
                    connection.release();
                    const {experience,trainerLvl} = result[0];
                    logger.info("ADDTRAINER EXP: " + experience,trainerLvl)
                    this.checkTrainerLvlUpAllowed(experience,trainerLvl,trainerId)
                })

            })
        })
    },
    checkTrainerLvlUpAllowed(experience,trainerLvl,trainerId) {
        logger.info("CHECK TRAINER LVL UP!" + experience +" " + trainerLvl)
        logger.info((Math.pow(2,trainerLvl)));
        if (experience >= (250*(Math.pow(2,trainerLvl )))) {this.trainerLvlUp(trainerId);}
    },
    trainerLvlUp(trainerId) {
        dbconnection.getConnection((err,connection) => {
            if (err) next(err);

            connection.query(trainerLvlUpQuery,[trainerId],(error,result,fields) => {
                if (error) nextTick(error);
                connection.release();
                logger.info("TRAINER LVL UP!")
            })
        })
    },
}