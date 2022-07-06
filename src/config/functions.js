
module.exports = {
    getRandom6Digits() {
        const random6Digits = Math.floor(100000 + Math.random() * 900000);
        return random6Digits.toString();
    },
    isEmpty(result) {
        if (Object.keys(result).length === 1) {
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
        
        
    }

}
