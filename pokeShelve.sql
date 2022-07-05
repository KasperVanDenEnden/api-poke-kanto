
DROP TABLE IF EXISTS `pokedex`;
DROP TABLE IF EXISTS `bag`;
DROP TABLE IF EXISTS `trainerBag`;
DROP TABLE IF EXISTS `storage`;
DROP TABLE IF EXISTS `trainerStorage`;
DROP TABLE IF EXISTS `trainer`;

--
-- Table structure for all tables
--

CREATE TABLE `trainer` (
  `trainerId` varchar(6) NOT NULL,
  `name` varchar(10) NOT NULL,
  `pwd` varchar(10) NOT NULL,
  `trainerLvl` int NOT NULL DEFAULT 0,
  `experience` int NOT NULL DEFAULT 0,
  `saldo` int NOT NULL DEFAULT 3000,
  `slotOne` varchar(25) NOT NULL DEFAULT '-',
  `slotTwo` varchar(25) NOT NULL DEFAULT '-',
  `slotThree` varchar(25) NOT NULL DEFAULT '-',
  `slotFour` varchar(25) NOT NULL DEFAULT '-',
  `slotFive` varchar(25) NOT NULL DEFAULT '-',
  `slotSix` varchar(25) NOT NULL DEFAULT '-',
  PRIMARY KEY (`trainerId`)
);

CREATE TABLE `pokedex` (
  `dexNr` int NOT NULL,
  `pokemon` varchar(25) NOT NULL DEFAULT 'Missingno',
  `type` varchar(25) NOT NULL,
  `catchRate` int NOT NULL DEFAULT 0.5,
  `minLevelCatch` int NOT NULL DEFAULT 5,
  `maxLevelCatch` int NOT NULL DEFAULT 20,
  `evolution` varchar(25) NULL DEFAULT 'none',
  `evolveLvl` varchar(4) NULL DEFAULT 'none',
  `evolveItem` varchar(25) NULL DEFAULT 'none',
  PRIMARY KEY (`dexNr`)
);

CREATE TABLE `trainerBag` (
    `bagId` int NOT NULL AUTO_INCREMENT,
    `trainerId` varchar(6) NOT NULL,
    PRIMARY KEY (`bagId`),
    CONSTRAINT FK_TrainerBag FOREIGN KEY (trainerId) REFERENCES `trainer` (trainerId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `bag` (
    `bagId` int NOT NULL,
    `item` varchar(25) NOT NULL,
    `sort` varchar(25) NOT NULL,
    `quantity` int NULL DEFAULT 0,
    PRIMARY KEY (`bagId`,`item`),
    CONSTRAINT FK_BagTrainerBag FOREIGN KEY (bagId) REFERENCES `trainerBag` (bagId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `trainerStorage` (
    `storageId` int NOT NULL AUTO_INCREMENT,
    `trainerId` varchar(6) NOT NULL,
    PRIMARY KEY (`storageId`),
    CONSTRAINT FK_TrainerStorage FOREIGN KEY (trainerId) REFERENCES `trainer` (trainerId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `storage` (
    `storageId` int NOT NULL,
    `pokemon` varchar(25) NOT NULL,
    `lvl` int NOT NULL,
    `favorite` int NOT NULL DEFAULT 0,
    CONSTRAINT FK_StorageTrainerStorage FOREIGN KEY (storageId) REFERENCES `trainerStorage` (storageId) ON UPDATE CASCADE ON DELETE CASCADE
);


--
-- Inserting basic data in all tables
--

LOCK TABLES `trainer` WRITE;
INSERT INTO `trainer` (`name`,`pwd`,`trainerId`) VALUES 
('Kaspeon','Trainer#1','061296'),
('Kaspirio','Trainer#2','120696'),
('Flash','Trainer#3','961206');
UNLOCK TABLES;

LOCK TABLES `pokedex` WRITE;
INSERT INTO `pokedex` (`dexNr`,`pokemon`,`type`,`catchRate`,`evolution`) VALUES
(1,'Bulbasaur','Grass/Poisen',1,'Ivysaur'),
(2,'Ivysaur','Grass/Poisen',0.5,'Venasaur'),
(3,'Venasaur','Grass/Poisen',0.25,'none'),
(4,'Charmander','Fire',1,'Charmeleon'),
(5,'Charmeleon','Fire',0.5,'Charizard'),
(6,'Charizard','Fire/Flying',0.25,'none'),
(7,'Squirtle','Water',1,'Wartortle'),
(8,'Wartortle','Water',0.5,'Blastoise'),
(9,'Blastoise','Water',0.25,'none');
UNLOCK TABLES;

LOCK TABLES `trainerBag` WRITE;
INSERT INTO `trainerBag` (`trainerId`) VALUES 
('061296'), 
('120696'),
('961206');
UNLOCK TABLES;

LOCK TABLES `bag` WRITE;
INSERT INTO `bag` VALUES 
(1,'Poke Ball','Ball',25),
(2,'Great Ball','Ball',5),
(3,'Ultra Ball','Ball',1);
UNLOCK TABLES;

LOCK TABLES `trainerStorage` WRITE;
INSERT INTO `trainerStorage` (`trainerId`) VALUES 
('061296'), 
('120696'),
('961206');
UNLOCK TABLES;

LOCK TABLES `storage` WRITE;
INSERT INTO `storage` (`storageId`) VALUES 
(1),
(2),
(3);
UNLOCK TABLES;
