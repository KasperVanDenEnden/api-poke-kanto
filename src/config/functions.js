const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const logger = require("./config").logger;

const threwBall = "UPDATE bag SET quantity = quantity - 1 WHERE bagId = ? AND item = ?;"
const itemsLeft = "SELECT quantity FROM bag WHERE bagId = ? AND item = ?;"

module.exports = {
    getRandom6Digits() {
        const random6Digits = Math.floor(100000 + Math.random() * 900000);
        return random6Digits.toString();
    },
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
        if (pokemon === "Nidoran♂") { return "♂";}
        if (pokemon === "Nidoran♀") { return "♀";}
        if (pokemon === "Magenemite" || pokemon === "Magneton") { return "~"}
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
    selectKeyTrainerId(result) {
        Object.keys(result).forEach(function(key) {
            var row = result[key];
            return row.trainerId;
        })
    },
    getSlotString(slot) {
        logger.info(slot);
        if (slot == 1) { return "slotOne";}
        if (slot == 2) { return "slotTwo";}
        if (slot == 3) { return "slotThree";}
        if (slot == 4) { return "slotFour";}
        if (slot == 5) { return "slotFive";}
        if (slot == 6) { return "slotSix";}
    },
    checkAlreadyInSlotQuery(slot) {
        const strBegin = 'SELECT trainerId FROM trainer WHERE ';
        const strEnd = ' = ? AND trainerId = ?;';
        return strBegin + this.getSlotString(slot) + strEnd;
    },
    putInSlotQuery(slot) {
        const strBegin = 'UPDATE trainer SET ';
        const strEnd = ' = ? WHERE trainerId = ?;';
        return strBegin + this.getSlotString(slot) + strEnd;
    },
    emptySlotQuery(slot) {
        const strBegin = 'UPDATE trainer SET ';
        const strEnd = ' WHERE trainerId = ?;';
        if (slot == 1) { return strBegin + "slotOne = slotTwo, slotTwo = slotThree, slotThree = slotFour, slotFour = slotFive, slotFive = slotSix, slotSix = '-'" + strEnd;}
        if (slot == 2) { return strBegin + "slotTwo = slotThree, slotThree = slotFour, slotFour = slotFive, slotFive = slotSix, slotSix = '-'" + strEnd;}
        if (slot == 3) { return strBegin + "slotThree = slotFour, slotFour = slotFive, slotFive = slotSix, slotSix = '-'" + strEnd;}
        if (slot == 4) { return strBegin + "slotFour = slotFive, slotFive = slotSix, slotSix = '-'" + strEnd;}
        if (slot == 5) { return strBegin + "slotFive = slotSix, slotSix = '-'" + strEnd;}
        if (slot == 6) { return strBegin + "slotSix = ''" + strEnd;}
 
    },
    firstEmptySlotQuery(slotOne,slotTwo,slotThree,slotFour,slotFive,slotSix) {
        const slotsUsed = [];
        slotsUsed.push(slotOne,slotTwo,slotThree,slotFour,slotFive,slotSix);
        let slotsUsedCount = 0;
        
        slotsUsed.forEach(element => {
            if (this.isNotEmpty(element)) {
                slotsUsedCount++;
            }
        });
        logger.info('slotsUsedCount: ' + slotsUsedCount );
        const strBegin = "UPDATE trainer SET "
        const strEnd = " WHERE trainerId = ?;"

        if (slotsUsedCount == 0) { return strBegin + "slotOne = ?" + strEnd;}
        if (slotsUsedCount == 1) { return strBegin + "slotTwo = ?" + strEnd;}
        if (slotsUsedCount == 2) { return strBegin + "slotThree = ?" + strEnd;}
        if (slotsUsedCount == 3) { return strBegin + "slotFour = ?" + strEnd;}
        if (slotsUsedCount == 4) { return strBegin + "slotFive = ?" + strEnd;}
        if (slotsUsedCount == 5) { return strBegin + "slotSix = ?" + strEnd;}
        if (slotsUsedCount == 6) { return "Slots full!";}

    },
    pokemonAlreadyInSlot(slotOne,slotTwo,slotThree,slotFour,slotFive,slotSix,slotPokemon) {
        const slots = [];
        slots.push(slotOne,slotTwo,slotThree,slotFour,slotFive,slotSix);
        let inSlot = false;
        slots.forEach(element => {
            if (element === slotPokemon) {
                inSlot = true;
            }
        });
        return inSlot;
    },

    // lotery functions
    getTicketMatchingNumbers(ticket,trainerId) {
        const ticketNumbers = ticket.split("");
        let matches = 0;
        for (let i = 0; i < 6;i++) {
            if (trainerId.includes(ticketNumbers[i])) {
                matches++;
            }
        }
        return matches;
    },
    getLoteryMessage(matches) {
        if (matches > 0) {
            return "You won with " + matches + " matching numbers!"
        } else {
            return "Sorry no matching numbers, better luck next Time!"
        }
    },
    getLoteryPrize(matches) {
        if (matches === 1) {
            return "Poke Ball";
        } else if (matches === 2) {
            return "Pokècoins";
        } else if (matches === 3) {
            return "Great Ball";
        } else if (matches === 4) {
            return "Pokècoins";
        } else if (matches === 5) {
            return "Ultra Ball";
        } else if (matches === 6) {
            return "Master Ball";
        }
    },
    getLoteryPrizeQuantity(matches) {
        if (matches === 1) {
            return 30;
        } else if (matches === 2) {
            return 5000;
        } else if (matches === 3) {
            return 20;
        } else if (matches === 4) {
            return 10000;
        } else if (matches === 5) {
            return 15;
        } else if (matches === 6) {
            return 1;
        }
    },
    getItemType(prize) {
        if (prize.includes("Ball")) {
            return "Ball";
        }
        return "Coins";
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

    // locations
    locationDexNr(location) {
        let dexNrs;
        if (location === "Grass") {dexNrs = this.grassDexNr();}
        if (location === "Tunnel") {dexNrs = this.tunnelDexNr();}
        if (location === "Plain") {dexNrs = this.plainDexNr();}
        if (location === "River") {dexNrs = this.riverDexNr();}
        if (location === "Lake") {dexNrs = this.lakeDexNr();}
        if (location === "Fields") {dexNrs = this.fieldsDexNr();}
        if (location === "Beach") {dexNrs = this.beachDexNr();}
        if (location === "Cave") {dexNrs = this.caveDexNr();}
        if (location === "Forest") {dexNrs = this.forestDexNr();}
        if (location === "Desert") {dexNrs = this.desertDexNr();}
        if (location === "Ocean") {dexNrs = this.oceanDexNr();}
        if (location === "Lab") {dexNrs = this.labDexNr();}
        if (location === "Lab") {dexNrs = this.safariDexNr()}
        if (location === "Mountain") {dexNrs = this.mountainDexNr();}
        if (location === "Mansion") {dexNrs = this.mansionDexNr();}
        if (location === "Volcano") {dexNrs = this.volcanoDexNr();}

        const randomDexNr = dexNrs[Math.floor(Math.random()*dexNrs.length)];
        return randomDexNr;
    },
    grassDexNr() {
        const dexNr = [];
        dexNr.push(10,13,19);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(16,21)}
        return dexNr;
    },
    tunnelDexNr() {
        const dexNr = [];
        dexNr.push(41,41,50,50,74,74);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(27,46,66)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(63)}
        return dexNr;
    },
    plainDexNr() {
        const dexNr = [];
        dexNr.push(16,19,21,23);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(17,20,22)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(29,32,56)}
        return dexNr;
    },
    riverDexNr() {
        const dexNr = [];
        dexNr.push(129,129,129);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(54,118)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(60)}
        return dexNr;
    },
    lakeDexNr() {
        const dexNr = [];
        dexNr.push(129,129,129,129);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(54,60,61,118)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(130)}
        return dexNr;
    },
    fieldsDexNr() {
        const dexNr = [];
        dexNr.push(10,13,16,19,21,23,109);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(11,14,17,20,22)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(133,143)}
        return dexNr;
    },
    beachDexNr() {
        const dexNr = [];
        dexNr.push(54,79,11,129,129,129);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(72,86,90,98,116,120,130)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(7,131)}
        return dexNr;
    },
    forestDexNr() {
        const dexNr = [];
        dexNr.push(10,13,16,43,102);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(11,14,17)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(1,12,15,44,83)}
        return dexNr;
    },
    caveDexNr() {
        const dexNr = [];
        dexNr.push(27,41,66,74,104);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(28,42,67,75)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(35,105)}
        return dexNr;
    },
    desertDexNr() {
        const dexNr = [];
        dexNr.push(27,50,74,104);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(28,51,75)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(95,105)}
        return dexNr;
    },
    oceanDexNr() {
        const dexNr = [];
        dexNr.push(72,86,90,98,116,118,129);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(73,87,91,99,117,119)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(130,131)}
        return dexNr;
    },
    labDexNr() {
        const dexNr = [];
        dexNr.push(39,41,42,50,63,81,100);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(64,82,101)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(125)}
        return dexNr;
    },
    safariDexNr() {
        const dexNr = [];
        dexNr.push(25,29,32,46,48,54,60,84,102,118,129);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(25,30,33,47,49,79,111,119,147)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(113,115,127,127,128,148)}
        return dexNr;
    },
    mountainDexNr() {
        const dexNr = [];
        dexNr.push(23,27,41,66,74,104)
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(17,20,22,24,28,30,33,42,67,75,95,105,111,112)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(35)}
        return dexNr;
    },
    mansionDexNr() {
        const dexNr = [];
        dexNr.push(19,20,88,92,96,109);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(89,93,97,110)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(114,112,132,133,134)}
        return dexNr;
    },
    volcanoDexNr() {
        const dexNr = [];
        dexNr.push(66,67,74,75);
        if (Math.floor(Math.random() * 2) == 1) { dexNr.push(47,58,77,111)}
        if (Math.floor(Math.random() * 3) == 2) { dexNr.push(4,48,59,78,112,126,136)}

        logger.info("DexNr: " + dexNr);
        return dexNr;
    },
    

}
