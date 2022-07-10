const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { nextTick } = require("process");
const logger = require("./config").logger;

module.exports = {
    getRandom6Digits() {
        const random6Digits = Math.floor(100000 + Math.random() * 900000);
        return random6Digits.toString();
    },
   
    // checks functions
    isNotEmpty(result) {
        if (Object.keys(result).length === 1) {
            return true;
        }
        return false;
    },
    isNotEmptyResults(results) {
        if (Object.keys(results).length > 0) {
            return true;
        }
        return false;
    },
    updateSuccesfull(message) {
        if (message.includes("Changed: 1")) {
            return true;
        }
        return false;
    },
    affectedRow(affectedRow) {
        if (affectedRow === 1) {
            return true;
        }
        return false;
    },
    affectedRows(affectedRows) {
        if (affectedRows > 0) {
            return true;
        }
        return false;
    },
    arrayIsEmpty(array) {
        if (array.length === 0) {
            return true;
        } 
        return false;
    },


}
