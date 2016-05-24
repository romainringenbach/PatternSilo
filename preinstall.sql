CREATE DATABASE IF NOT EXISTS DBPatternSilo;
DROP USER IF EXISTS 'PatternSilo'@'localhost';
CREATE USER 'PatternSilo'@'localhost' IDENTIFIED BY 'admin_password';
GRANT CREATE, UPDATE, INSERT, INDEX, DROP, SELECT, DELETE ON *.* TO 'PatternSilo'@'localhost';
FLUSH PRIVILEGES;

USE `DBPatternSilo` ;

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
  PRIMARY KEY (`login`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;