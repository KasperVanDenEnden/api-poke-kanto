-- 
-- Gebruik dit script om je lokale database, en je test-database te maken.
-- LET OP: je moet als root ingelogd zijn om dit script uit te kunnen voeren.
-- Dit script creëert de database, de user, en opent de nieuwe database.
-- Daarna kun je het poke-kanto.sql script importeren.
-- In de connection settings gebruik je dan de nieuwe database, de user en het password.
-- 
DROP DATABASE IF EXISTS `poke-kanto`;
CREATE DATABASE `poke-kanto`;
DROP DATABASE IF EXISTS `poke-kanto-testdb`;
CREATE DATABASE `poke-kanto-testdb`;
-- poke-kanto-user aanmaken
CREATE USER IF NOT EXISTS 'poke-kanto-user'@'localhost' IDENTIFIED BY 'secret';
CREATE USER IF NOT EXISTS 'poke-kanto-user'@'%' IDENTIFIED BY 'secret';
-- geef rechten aan deze user
GRANT SELECT, INSERT, DELETE, UPDATE ON `poke-kanto`.* TO 'poke-kanto-user'@'%';
GRANT SELECT, INSERT, DELETE, UPDATE ON `poke-kanto-testdb`.* TO 'poke-kanto-user'@'%';

USE `poke-kanto`;