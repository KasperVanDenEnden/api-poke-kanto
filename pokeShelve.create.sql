-- 
-- Gebruik dit script om je lokale database, en je test-database te maken.
-- LET OP: je moet als root ingelogd zijn om dit script uit te kunnen voeren.
-- Dit script creëert de database, de user, en opent de nieuwe database.
-- Daarna kun je het pokeShelve.sql script importeren.
-- In de connection settings gebruik je dan de nieuwe database, de user en het password.
-- 
DROP DATABASE IF EXISTS `pokeShelve`;
CREATE DATABASE `pokeShelve`;
DROP DATABASE IF EXISTS `pokeShelve-testdb`;
CREATE DATABASE `pokeShelve-testdb`;
-- pokeShelve-user aanmaken
CREATE USER IF NOT EXISTS 'pokeShelve-user'@'localhost' IDENTIFIED BY 'secret';
CREATE USER IF NOT EXISTS 'pokeShelve-user'@'%' IDENTIFIED BY 'secret';
-- geef rechten aan deze user
GRANT SELECT, INSERT, DELETE, UPDATE ON `pokeShelve`.* TO 'pokeShelve-user'@'%';
GRANT SELECT, INSERT, DELETE, UPDATE ON `pokeShelve-testdb`.* TO 'pokeShelve-user'@'%';

USE `pokeShelve`;