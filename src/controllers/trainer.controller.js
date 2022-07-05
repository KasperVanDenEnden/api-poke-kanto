const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const logger = require("../config/config").logger;

const loginQuery = 'SELECT name, pwd FROM trainer WHERE name = ?'


module.exports = { 
    login: (req, res, next) => {
        const {
            name,
            pwd,
        } = req.body;

        try {
            assert(typeof name === 'string', 'Name must be a string');
            assert(typeof pwd === 'string', 'Password must be a string');

            dbconnection.getConnection((err, connection) => {
                if (err) next(err);

                connection.query(loginQuery, emailAdress, (error, results, fields) => {
                    connection.release();
                    if (error) next(error);

                    const trainer = results[0];

                    if (trainer) {
                        bcrypt.compare(password, trainer.password, function (err, result) {
                            if (result || password === trainer.password) {
                                jwt.sign({
                                        trainerId: trainer.id
                                    },
                                    process.env.JWT_SECRET, {
                                        expiresIn: '100d'
                                    },
                                    (err, token) => {
                                        if (token) {
                                            trainer.token = token;
                                            let trainerOutput = {
                                                ...trainer,
                                                password, 
                                            }
                                            res.status(200).json({
                                                status: 200,
                                                result: trainerOutput
                                            });
                                        }
                                        if (err) next(err);
                                    });
                            } else {
                                res.status(400).json({
                                    status: 400,
                                    message: "Incorrect password"
                                });
                            }
                        })
                    } else {
                        res.status(404).json({
                            status: 404,
                            message: "Trainer does not exist"
                        });
                    }
                });
            });
        } catch (err) {
            res.status(400).json({
                status: 400,
                message: err.message,
            });
        }
    },
    validateToken: (req, res, next) => {
        const authHeader = req.headers.authorization
        if (authHeader) {
            const token = authHeader.substring(7, authHeader.length)

            jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) {
                    res.status(401).json({
                        status: 401,
                        message: "Unauthorized"
                    })
                } else {
                    next(payload);
                }
            })
        } else {
            res.status(401).json({
                status: 401,
                message: "Authorization header is missing"
            })
        }
    },

}    