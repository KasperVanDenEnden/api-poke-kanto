const dbconnection = require("../../database/dbconnection");
const assert = require("assert");

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
        const max = 500;
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
        if (gender === 1) {return "♂";}
        return "♀";
    },
    caughtPokemon(dexNr,pokemon,type,level,gender,shinyBool) {
        let caughtPokemon = {dexNr,pokemon,type,level,gender};
        if (shinyBool) {
            const shiny = true;
            let caughtPokemon = {shiny};
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
    threwBall(bagId,url){
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
    // lotery functions
    getTicketMatchingNumbers(ticket,trainerId) {
        const ticketNumbers = ticket.split("");
        const matches = 0;
        ticketNumbers.forEach(element => {
            if (ticket.includes(element)) {
                count++;
            }
        });
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
            return 50000;
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

}