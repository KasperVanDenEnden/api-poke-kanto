
const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { nextTick } = require("process");
const logger = require("./config").logger;

module.exports = {
 // excavate
 excavateFossil() {
    const dugUp = ["Old Amber","Dome Fossil","Helix Fossil"]
    return dugUp;
},
excavateValuable() {
   let dugUp;
   const typeValuable = Math.floor(Math.random() * 5) 
   if (typeValuable == 0 || typeValuable == 2 || typeValuable == 4 ) { dugUp =["Red Shard","Blue Shard","Green Shard","Yellow Shard"];}
   if (typeValuable == 1) { dugUp =["Nugget","Pearl","Stardust","Star Piece","Rare Bone",];}
   if (typeValuable == 3) { dugUp =["Big Nugget","Big Pearl","Pearl String","Comet Shard"];}

    return dugUp;
},
excavateStone() {
    const dugUp = ["Moon Stone","Leaf Stone","Fire Stone","Water Stone","Thunder Stone","Everstone"]
    return dugUp;
},
getExcavatedSort(excavated) {
    if (excavated.includes("Shard")) {return "Shard";}
    if (excavated.includes("Stone")) { return "Stone";}
    if (excavated.includes("Old Amber","Fossil")) { return "Fossil";}
    if (excavated.includes("Nugget","Pearl","Star","Bone","Comet")) { return "Treasure";}
    return "skree";
}

}