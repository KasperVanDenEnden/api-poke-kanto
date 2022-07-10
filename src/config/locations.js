const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { nextTick } = require("process");
const logger = require("./config").logger;

module.exports = {
  
  
  // locations
   locationUnlocked(trainerLvl,location) {
    if (location === "Grass" ) {return true}
    if (location === "Tunnel" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Plain" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "River" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Lake" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Fields" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Beach" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Forest" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Cave" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Desert" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Ocean" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Lab" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Safari" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Mountain" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Mansion" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    if (location === "Volcano" && trainerLvl >= this.locationLvlRequired(location)) {return true;}
    return false;

},
locationLvlRequired(location) {
    if (location === "Grass") {return 1}
    if (location === "Tunnel") {return 5;}
    if (location === "Plain") {return 10;}
    if (location === "River") {return 10;}
    if (location === "Lake") {return 15;}
    if (location === "Fields") {return 20;}
    if (location === "Beach") {return 25;}
    if (location === "Forest") {return 30;}
    if (location === "Cave") {return 30;}
    if (location === "Desert") {return 35;}
    if (location === "Ocean") {return 40;}
    if (location === "Lab") {return 45;}
    if (location === "Safari") {return 50;}
    if (location === "Mountain") {return 50;}
    if (location === "Mansion") {return 55;}
    if (location === "Volcano") {return 60;}
},
locationDexNr(location) {
    let dexNrs;
    if (location === "Grass") {dexNrs = this.grassDexNr();}
    if (location === "Tunnel") {dexNrs = this.tunnelDexNr();}
    if (location === "Plain") {dexNrs = this.plainDexNr();}
    if (location === "River") {dexNrs = this.riverDexNr();}
    if (location === "Lake") {dexNrs = this.lakeDexNr();}
    if (location === "Fields") {dexNrs = this.fieldsDexNr();}
    if (location === "Beach") {dexNrs = this.beachDexNr();}
    if (location === "Forest") {dexNrs = this.forestDexNr();}
    if (location === "Cave") {dexNrs = this.caveDexNr();}
    if (location === "Desert") {dexNrs = this.desertDexNr();}
    if (location === "Ocean") {dexNrs = this.oceanDexNr();}
    if (location === "Lab") {dexNrs = this.labDexNr();}
    if (location === "Safari") {dexNrs = this.safariDexNr()}
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