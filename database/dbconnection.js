const mysql = require("mysql2");
require("dotenv").config();
const logger = require("../src/config/config").logger;

const pool = mysql.createPool({
    connectionLimit: 200,
    waitForConnections: true,
    queueLimit: 0,
    multipleStatements: true,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

pool.on('connection', function (connection) {
  logger.info(`Connected to database '${connection.config.database}'`)
})

pool.on('acquire', function (connection) {
  logger.info('Connection %d acquired', connection.threadId)
})

pool.on('release', function (connection) {
  logger.info('Connection %d released', connection.threadId)
})

module.exports = pool;
