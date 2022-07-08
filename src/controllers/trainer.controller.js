const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { info } = require("console");
const e = require("express");
const logger = require("../config/config").logger;
const functions = require("../config/functions");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/config").jwtSecretKey;

const loginQuery =
  "SELECT trainerId, pwd, name FROM trainer WHERE trainerId = ?;";
const addTrainerQuery =
  "INSERT INTO `trainer` (`name`,`pwd`,`trainerId`) VALUES (?,?,?);";
const getNewTrainerQuery =
  "SELECT trainerId, name, trainerLvl FROM trainer WHERE trainerId = ?;";
const nicknameExistQuery = "SELECT name FROM trainer WHERE name =?;";
const trainerIdExistQuery =
  "SELECT trainerId FROM trainer WHERE trainerId = ?;";
const changePwdQuery = "UPDATE trainer SET pwd = ? WHERE trainerId = ?;";
const getTrainerCardQuery = "SELECT * FROM trainer WHERE trainerId = ?;";

module.exports = {
  checkNewTrainer: (req,res,next) => {
    const { nickname, pwd } = req.body;
    try {
      assert(typeof nickname === "string", "Nickname must be a string");
      assert(typeof pwd === "string", "Password must be a string");

      dbconnection.getConnection((err, connection) => {
        if (err) next(err);

        connection.query(
          nicknameExistQuery,
          [nickname],
          (error, result, fields) => {
            if (error) next(error);
            if (functions.isNotEmpty(result)) {
              res.status(401).json({
                status: 401,
                message: "Trainer with this name already exists.",
              });
            } else {
              next();
            }
          }
        );
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: err.message,
      });
    }
  },
  addTrainer: (req,res,next) => {
    const { nickname, pwd } = req.body;

    dbconnection.getConnection((err, connection) => {
      if (err) next(err);

      const newTrainerId = functions.getRandom6Digits();
      connection.query(
        trainerIdExistQuery,
        [newTrainerId],
        (error, result, fields) => {
          if (error) next(error);

          if (functions.isNotEmpty(result)) {
            res.status(400).json({
              status: 400,
              message:
                "Oops we drew the same trainerId as someone else, please try again",
            });
          } else {
            trainerId = newTrainerId;
            count = 10;
            connection.query(
              addTrainerQuery,
              [nickname, pwd, trainerId],
              (error, result, fields) => {
                if (error) next(error);
                connection.query(
                  getNewTrainerQuery,
                  [trainerId],
                  (error, result, fields) => {
                    if (error) next(error);
                    connection.release();

                    res.status(200).json({
                      status: 201,
                      result: result,
                      message:
                        "Save your trainerId somewhere. You need it to login to your account!",
                    });
                  }
                );
              }
            );
          }
        }
      );
    });
  },
  pwdChange: (req,res,next) => {
    const { trainerId, pwd, pwdNew, pwdCopy } = req.body;
    const tokenId = req.tokenId;

    if (tokenId === trainerId) {
      try {
        assert(typeof pwd === "string", "Password must be a string");
        assert(typeof pwdNew === "string", "New password must be a string");
        assert(pwdCopy === pwdNew, "Passwords do not match");
        assert(pwd !== pwdNew, "New password is the same as old password.");

        dbconnection.getConnection((err, connection) => {
          if (err) next(err);

          connection.query(
            changePwdQuery,
            [pwdNew, trainerId],
            (err, result, fields) => {
              if (err) throw err;
              connection.release();
              const message = result.info;
              if (functions.updateSuccesfull(message)) {
                res.status(200).json({
                  status: 200,
                  message: "Your password has been changed succesfully",
                });
              } else {
                res.status(400).json({
                  status: 400,
                  message: "Your password is incorrect",
                });
              }
            }
          );
        });
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: err.message,
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        message:
          "This is not your account, we can not allow you to change this password",
      });
    }
  },
  login: (req,res,next) => {
    const { trainerId, pwd } = req.body;

    try {
      assert(typeof trainerId === "string", "TrainerId must be a string");
      assert(typeof pwd === "string", "Password must be a string");

      dbconnection.getConnection((err, connection) => {
        if (err) next(err);

        connection.query(loginQuery, trainerId, (error, results, fields) => {
          connection.release();
          if (error) next(error);

          const trainer = results[0];

          if (trainer) {
            bcrypt.compare(pwd, trainer.pwd, function (err, result) {
              if (result || pwd === trainer.pwd) {
                jwt.sign(
                  {
                    tokenId: trainer.trainerId,
                    trainer: trainer.name,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "100d",
                  },
                  (err, token) => {
                    if (token) {
                      trainer.token = token;
                      let trainerOutput = {
                        ...trainer,
                        pwd,
                      };
                      res.status(200).json({
                        status: 200,
                        result: trainerOutput,
                      });
                    }
                    if (err) next(err);
                  }
                );
              } else {
                res.status(400).json({
                  status: 400,
                  message: "Incorrect password",
                });
              }
            });
          } else {
            res.status(404).json({
              status: 404,
              message: "Trainer does not exist",
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
  validateToken: (req,res,next) => {
    logger.info("Validate token");
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.substring(7, authHeader.length);
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          res.status(401).json({
            status: 401,
            message: "Unauthorized",
          });
        } else {
          const { tokenId, trainer } = payload;
          req.tokenId = tokenId;
          req.trainer = trainer;
          next();
        }
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "Authorization header is missing",
      });
    }
  },
  getTrainerCard: (req,res,next) => {
    const tokenId = req.tokenId;
    dbconnection.getConnection((err, connection) => {
      if (err) next(err);
      connection.query(
        getTrainerCardQuery,
        [tokenId],
        (error, result, fields) => {
          if (error) next(error);
          connection.release();
          delete result[0].pwd;
          delete result[0].experience;
          if (functions.isNotEmpty(result)) {
            res.status(200).json({
              status: 200,
              result: result,
            });
          } else {
            res.status(400).json({
              status: 400,
              message:
                "You seem to have lost your Trainer Card. You will have to request a new one!",
            });
          }
        }
      );
    });
  },
};
