const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { nextTick } = require("process");
const logger = require("./config").logger;

const threwBall = "UPDATE bag SET quantity = quantity - 1 WHERE bagId = ? AND item = ?;";
const itemsLeft = "SELECT quantity FROM bag WHERE bagId = ? AND item = ?;";


module.exports = {
    randomDexNr() {
        const dexNrs = [];
        for(let i = 1; i < 144; i++) {
            dexNrs.push(i);
        }
        dexNrs.push(147,148,149);
        const randomDexNr = dexNrs[Math.floor(Math.random()*dexNrs.length)];
        return randomDexNr;
    },
    randomLegendaryDexNr() {
        const dexNrs = [];
        dexNrs.push(144,145,146,150,151);
        const randomDexNr = dexNrs[Math.floor(Math.random()*dexNrs.length)];
        return randomDexNr;
    },
    shiny() {
        const max = 250;
        const min = 1;
        const shinyOdd = Math.floor(Math.random() * (max - min + 1) + min)
        if (shinyOdd === 126) {
            return true;
        }
        return false;
    },
    maleOrFemale(pokemon){
        let gender = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (pokemon === "Nidoran♂" || pokemon === "Nidorino") { return "♂";}
        if (pokemon === "Nidoran♀" || pokemon === "Nidorina") { return "♀";}
        if (pokemon === "Magenemite" || pokemon === "Magneton" || pokemon === "Voltorb" || pokemon === "Electrode" || pokemon === "Porygon" || pokemon === "Ditto") { return "~"}
        if (pokemon === "Articuno" || pokemon === "Zapdos" || pokemon === "Moltres" || pokemon === "Mewtwo" || pokemon === "Mew") { return "~"}
        if (gender === 1) {return "♂";}
        return "♀";
    },
    caughtPokemon(dexNr,pokemon,type,level,gender,shinyBool,trainer) {
        let caughtPokemon = {dexNr,pokemon,type,level,gender,trainer};
        if (shinyBool) {
            caughtPokemon.shiny = 1;
        }
        return caughtPokemon;
    },
     catchPokeball(catchRate) {
        logger.info("CATCH POKE");
        let odd = 1;
        if (catchRate === 0.75) {
            odd = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        } else if (catchRate === 0.5) {
            odd = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        } else if (catchRate === 0.25) {
            odd = Math.floor(Math.random() * (4 - 1 + 1) + 1);
        }
        if (odd === 1) {
            return true;
        }
        return false;
    },
    catchGreatball(catchRate) {
        logger.info("CATCH GREAT");
        let odd = 1;
        if (catchRate === 0.5) {
            odd = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        } else if (catchRate === 0.25) {
            odd = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        }
        if (odd === 1) {
            return true;
        }
        return false;
    },
    catchUltraball(catchRate) {
        logger.info("CATCH ULTRA");
        let odd = 1;
        if (catchRate === 0.25) {
            odd = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        }
        if (odd === 1) {
            return true;
        }
        return false;
    },
    catchMasterball(catchRate) {

    },
    ballString(url) {
        urlParts = url.split("/")
        let item;
        if (urlParts[2] === "poke") {
            item = "Poke Ball"
        } else if (urlParts[2] === "great") {
            item = "Great Ball"
        } else if (urlParts[2] === "ultra") {
            item = "Ultra Ball"
        } else if (urlParts[2] === "master") {
            item = "Master Ball"
        }
        return item;
    },
    threwBall(bagId,url){
        let item = this.ballString(url);
        
        dbconnection.getConnection((err,connection) => {
            if (err) throw err

            connection.query(threwBall,[bagId,item],(error,result,fields) => {
                if (error) throw error;
                connection.release();
                
            })
        })
    },

}