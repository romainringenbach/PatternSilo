CREATE DATABASE IF NOT EXISTS DBPatternSilo;
DROP USER IF EXISTS 'PatternSilo'@'localhost';
CREATE USER 'PatternSilo'@'localhost' IDENTIFIED BY 'password';
GRANT CREATE, UPDATE, INSERT, INDEX, DROP, SELECT, DELETE ON db_password.* TO 'PatternSilo'@'localhost';
FLUSH PRIVILEGES;

USE `PatternSilo` ;

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema SiloAdmin
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `SiloAdmin` DEFAULT CHARACTER SET utf8 ;
USE `SiloAdmin` ;

-- -----------------------------------------------------
-- Table `SiloAdmin`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SiloAdmin`.`Users` ;

CREATE TABLE IF NOT EXISTS `SiloAdmin`.`Users` (
  `login` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
