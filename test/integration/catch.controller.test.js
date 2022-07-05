process.env.DB_DATABASE = process.env.DB_DATABASE || "pokeshelve";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const jwt = require("jsonwebtoken");
const dbconnection = require("../../database/dbconnection");

chai.should();
chai.expect();
chai.use(chaiHttp);

/**
 * Db queries to clear and fill the test database before each test.
 */

const CLEAR_TRAINER_TABLE = "DELETE IGNORE FROM `trainer`;";
const CLEAR_POKEDEX_TABLE = "DELETE IGNORE FROM `pokedex`;";
const CLEAR_TRAINERBAG_TABLE = "DELETE IGNORE FROM `trainerBag`;";
const CLEAR_BAG_TABLE = "DELETE IGNORE FROM `bag`;";
const CLEAR_TRAINERSTORAGE_TABLE = "DELETE IGNORE FROM `trainerStorage`;";
const CLEAR_STORAGE_TABLE = "DELETE IGNORE FROM `storage`;";
const CLEAR_DB =
CLEAR_TRAINER_TABLE + CLEAR_POKEDEX_TABLE + CLEAR_TRAINERBAG_TABLE + CLEAR_BAG_TABLE + CLEAR_TRAINERSTORAGE_TABLE + CLEAR_STORAGE_TABLE;

const INSERT_TRAINER = '';
const INSERT_POKEDEX = '';
const INSERT_TRAINERBAG = '';
const INSERT_BAG = '';
const INSERT_TRAINERSTORAGE = '';
const INSERT_STORAGE = '';
const INSERT_DB = 
INSERT_TRAINER + INSERT_POKEDEX + INSERT_TRAINERBAG + INSERT_BAG + INSERT_TRAINERSTORAGE + INSERT_STORAGE ;
