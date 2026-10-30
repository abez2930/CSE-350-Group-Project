CREATE DATABASE IF NOT EXISTS `weather_data`;
USE `weather_data`;

CREATE TABLE `cities` (
  `id` int NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(2) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `station` varchar(4) NOT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `humidity` decimal(5,2) DEFAULT NULL,
  `windDirection` varchar(10) DEFAULT NULL,
  `pressure` decimal(7,2) DEFAULT NULL,
  `conditions` varchar(50) DEFAULT NULL,
  `querytime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
)
--@block
SELECT * FROM CITIES;
--@block
DROP TABLE IF EXISTS `cities`;