
DROP TABLE IF EXISTS `pokedex`;
DROP TABLE IF EXISTS `bag`;
DROP TABLE IF EXISTS `trainerBag`;
DROP TABLE IF EXISTS `storage`;
DROP TABLE IF EXISTS `trainerStorage`;
DROP TABLE IF EXISTS `trainer`;
DROP TABLE IF EXISTS `evolve`;
DROP TABLE IF EXISTS `lotery`;
DROP TABLE IF EXISTS `item`;

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
    `pokemon` varchar(25) NOT NULL DEFAULT 'Missingno',
    `lvl` int NOT NULL DEFAULT 1,
    `favorite` int NOT NULL DEFAULT 0,
    CONSTRAINT FK_StorageTrainerStorage FOREIGN KEY (storageId) REFERENCES `trainerStorage` (storageId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `evolve` (
    `dexNr` int NOT NULL,
    `evolveItem` varchar(25) NOT NULL DEFAULT 'none',
    `evolveLvl` int NOT NULL DEFAULT 0,
    PRIMARY KEY (`dexNr`)
);

CREATE TABLE `lotery` (
    `trainerId` varchar(6) NOT NULL,
    `day` varchar(10) NOT NULL DEFAULT CURDATE(),
    `tickets` int NOT NULL DEFAULT 1,
    PRIMARY KEY (`trainerId`,`day`)
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

LOCK TABLES `lotery` WRITE;
INSERT INTO `lotery` (`trainerId`) VALUES 
('061296'), 
('120696'),
('961206');
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
(9,'Blastoise','Water',0.25,'none'),
(10,'Caterpie','Bug',1,'Metapod'),
(11,'Metapod','bug',0.5,'Butterfree'),
(12,'Butterfree','Bug/Flying',0.25,'none'),
(13,'Weedle','Bug/Poison',1,'Kakuna'),
(14,'Kakuna','Bug/Poison',0.5,'Beedril'),
(15,'Beedril','Bug/Poison',0.25,'none'),
(16,'Pidgey','Normal/Flying',1,'Pidgeotto'),
(17,'Pidgeotto','Normal/Flying',0.5,'Pidgeot'),
(18,'Pidgeot','Normal/Flying',0.25,'none'),
(19,'Rattata','Normal',1,'Raticate'),
(20,'Raticate','Normal',0.75,'none'),
(21,'Spearow','Normal/Flying',1,'Fearow'),
(22,'Fearow','Normal/Flying',0.75,'none'),
(23,'Ekans','Poison',1,'Arbok'),
(24,'Arbok','Poison',0.75,'none'),
(25,'Pikachu','Electric',1,'Raichu'),
(26,'Raichu','Electric',0.5,'none'),
(27,'Sandshrew','Ground',1,'Sandslash'),
(28,'Sandslash','Sandshrew',0.5,'none'),
(29,'Nidoran♀','Poison',1,'Nidorina'),
(30,'Nidorina','Poison',0.75,'Nidoqueen'),
(31,'NidoQueen','Poison/Ground',0.5,'none'),
(32,'Nidoran♂','Poison',1,'Nidorino'),
(33,'Nidorino','Poison',0.75,'Nidoking'),
(34,'Nidoking','Poison/Ground',0.5,'none'),
(35,'Clefairy','Normal',0.75,'Clefable'),
(36,'Clefable','Normal',0.5,'none'),
(37,'Vulpix','Fire',0.75,'Ninetails'),
(38,'Ninetails','Fire',0.5,'none'),
(39,'Jigllypuff','Normal',1,'Wigglytuff'),
(40,'Wigglytuff','Normal',0.5,'none'),
(41,'Zubat','Poison/Flying',1,'Golbat'),
(42,'Golbat','Poison/Flying',0.75,'none'),
(43,'Oddish','Grass/Poison',1,'Gloom'),
(44,'Gloom','Grass/Poison',0.75,'Vileplume'),
(45,'Vileplume','Grass/Poison',0.5,'none'),
(46,'Paras','Bug/Grass',1,'Parasect'),
(47,'Parasect','Bug/Grass',0.75,'none'),
(48,'Venonat','Bug/Poison',1,'Venomoth'),
(49,'Venomoth','Bug/Poison',0.75,'none'),
(50,'Diglett','Ground',1,'Dugtrio'),
(51,'Dugtrio','Ground',0.75,'none'),
(52,'Meowth','Normal',1,'Persian'),
(53,'Persian','Normal',0.5,'none'),
(54,'Psyduck','Water',1,'Golduck'),
(55,'Golduck','Water',0.5,'none'),
(56,'Mankey','Fighting',1,'Primeape'),
(57,'Primeape','Fighting',0.5,'none'),
(58,'Growlithe','Fire',0.75,'Arcanine'),
(59,'Arcanine','Fire',0.5,'none'),
(60,'Poliwag','Water',1,'Poliwhirl'),
(61,'Poliwhirl','Water',0.75,'Poliwrath'),
(62,'Poliwrath','Water/Fighting',0.5,'none'),
(63,'Abra','Psychic',1,'Kadabra'),
(64,'Kadabra','Psychic',0.75,'Alakazam'),
(65,'Alakazam','Psychic',0.5,'none'),
(66,'Machop','Fighting',1,'Machoke'),
(67,'Machoke','Fighting',0.75,'Machamp'),
(68,'Machamp','Fighting',0.5,'none'),
(69,'Bellsprout','Grass/Poison',1,'Weepingbell'),
(70,'Weepingbell','Grass/Poison',0.75,'Victreebel'),
(71,'Victreebel','Grass/Poison',0.5,'none'),
(72,'Tentacool','Water/Poison',1,'Tentacruel'),
(73,'Tentacruel','Water/Poison',0.5,'none'),
(74,'Geodude','Rock/Ground',1,'Graveler'),
(75,'Graveler','Rock/Ground',0.75,'Golem'),
(76,'Golem','Rock/Ground',0.5,'none'),
(77,'Ponyta','Fire',0.75,'Rapidash'),
(78,'Rapidash','Fire',0.5,'none'),
(79,'Slowpoke','Water/Psychic',1,'Slowbro'),
(80,'Slowbro','Water/Psychic',0.5,'none'),
(81,'Magnemite','Electric/Steel',1,'Magneton'),
(82,'Magneton','Electric/Steel',0.5,'none'),
(83,'Farfetch`d','Normal/Flying',0.5,'none'),
(84,'Doduo','Poison',1,'Dodrio'),
(85,'Dodrio','Poison',0.5,'none'),
(86,'Seel','Water',1,'Dewgong'),
(87,'Dewgong','Water/Ice',0.5,'none'),
(88,'Grimer','Poison',1,'Muk'),
(89,'Muk','Poison',0.5,'none'),
(90,'Shellder','Water',1,'Cloyster'),
(91,'Cloyster','Water/Ice',0.5,'none'),
(92,'Gastly','Ghost/Poison',1,'Haunter'),
(93,'Haunter','Ghost/Poison',0.5,'Gengar'),
(94,'Gengar','Ghost/Poison',0.25,'none'),
(95,'Onix','Rock/Ground',0.75,'none'),
(96,'Drowzee','Psychic',1,'Hypno'),
(97,'Hypno','Psychic',0.5,'none'),
(98,'Krabby','Water',1,'Kingler'),
(99,'Kingler','Water',0.5,'none'),
(100,'Voltorb','Electric',1,'Electrode'),
(101,'Electrode','Electric',0.5,'none'),
(102,'Exeggcute','Grass/Psychic',1,'Exeggutor'),
(103,'Exeggutor','Grass/Psychic',0.5,'none'),
(104,'Cubone','Ground',1,'Marowak'),
(105,'Marowak','Ground',0.5,'none'),
(106,'Hitmonlee','Fighting',0.5,'none'),
(107,'Hitmonchan','Fighting',0.5,'none'),
(108,'Lickytung','Normal',0.75,'none'),
(109,'koffing','Poison',1,'Weezing'),
(110,'Weezing','Poison',0.75,'none'),
(111,'Rhyhorn','Ground/Rock',1,'Rhydon'),
(112,'Rhydon','Ground/Rock',0.5,'none'),
(113,'Chansey','Normal',0.75,'none'),
(114,'Tangela','Grass',0.75,'none'),
(115,'Kangaskhan','Normal',0.5,'none'),
(116,'Horsea','Water',0.75,'Seadra'),
(117,'Seadra','Water',0.5,'none'),
(118,'Goldeen','Water',2,'Seaking'),
(119,'Seaking','Water',0.75,'none'),
(120,'Staryu','Water',1,'Starmie'),
(121,'Starmie','Water/Psychic',0.5,'none'),
(122,'Mr.Mime','Psychic',0.5,'none'),
(123,'Scyther','Bug/Flying',0.5,'none'),
(124,'Jynx','Ice/Psychic',0.5,'none'),
(125,'Elecabuzz','Electrix',0.5,'none'),
(126,'Magmar','Fire',0.5,'none'),
(127,'Pinsir','Bug',0.5,'none'),
(128,'Tauros','Normal',0.5,'none'),
(129,'Magikarp','Water',1,'Gyarados'),
(130,'Gyarados','Water/Flying',0.5,'none'),
(131,'Lapras','Ice',0.5,'none'),
(132,'Ditto','Normal',0.5,'none'),
(133,'Eevee','normal',0.5,'Vaporeon/Jolteon/Flareon'),
(134,'Vaporeon','Water',0.3,'none'),
(135,'Jolteon','Electric',0.4,'none'),
(136,'Flareon','Fire',0.4,'none'),
(137,'Porygon','Normal',0.5,'none'),
(138,'Omanyte','Rock/Water',0.4,'Omastar'),
(139,'Omastar','Rock/Water',0.25,'none'),
(140,'Kabuto','Rock/Water',0.4,'Kabutops'),
(141,'Kabutops','Rock/Water',0.25,'none'),
(142,'Aerodactyl','Rock/Flying',0.25,'none'),
(143,'Snorlax','Normal',0.5,'none'),
(144,'Articuno','Ice/Flying',0.1,'none'),
(145,'Zapdos','Electric/Flying',0.1,'none'),
(146,'Moltres','Fire/Flying',0.1,'none'),
(147,'Dratini','Dragon',0.5,'Dragonair'),
(148,'Dragonair','Dragon',0.4,'Dragonite'),
(149,'Dragonite','Dragon/Flying',0.3,'none'),
(150,'Mewtwo','Psychic',0.1,'none'),
(151,'Mew','Psychic',0.1,'none');
UNLOCK TABLES;


LOCK TABLES `evolve` WRITE;
INSERT INTO `evolve` (`dexNr`,`evolveItem`,`evolveLvl`) VALUES
(1,'none',16),
(2,'none',32),
(4,'none',16),
(5,'none',36),
(7,'none',16),
(8,'none',36),
(10,'none',7),
(11,'none',11),
(13,'none',7),
(14,'none',10),
(16,'none',18),
(17,'none',36),
(19,'none',20),
(21,'none',20),
(23,'none',22),
(25,'Thunder Stone',0),
(27,'none',22),
(29,'none',16),
(30,'Moon Stone',0),
(32,'none',16),
(33,'Moon Stone',0),
(35,'Moon Stone',0),
(37,'Fire Stone',0),
(39,'Moon Stone',0),
(41,'none',21),
(43,'none',21),
(44,'Leaf Stone',0),
(46,'none',24),
(48,'none',31),
(50,'none',26),
(52,'none',28),
(54,'none',33),
(56,'none',28),
(58,'Fire Stone',0),
(60,'none',25),
(61,'Water Stone',0),
(63,'none',16),
(64,'Lick Cable',0),
(66,'none',28),
(67,'Lick Cable',0),
(69,'none',21),
(70,'Leaf Stone',0),
(72,'none',30),
(74,'none',25),
(75,'Lick Cable',0),
(77,'none',40),
(79,'none',37),
(81,'none',30),
(84,'none',31),
(86,'none',34),
(88,'none',38),
(90,'Water Stone',0),
(92,'none',25),
(93,'Lick Cable',0),
(96,'none',26),
(98,'none',28),
(100,'none',30),
(102,'Leaf Stone',0),
(104,'none',28),
(109,'none',35),
(111,'none',42),
(116,'none',36),
(118,'none',33),
(120,'Water Stone',0),
(129,'none',20),
(133,'Leaf Stone/Water Stone/Thunder Stone',0),
(138,'none',40),
(140,'none',40),
(147,'none',30),
(148,'none',55);
UNLOCK TABLES;