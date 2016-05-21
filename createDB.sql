-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`PatternTypes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`PatternTypes` ;

CREATE TABLE IF NOT EXISTS `mydb`.`PatternTypes` (
  `type` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`type`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Patterns`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Patterns` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Patterns` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(20) NOT NULL,
  `parent` INT NULL,
  `weigth` INT NOT NULL,
  PRIMARY KEY (`id`, `type`),
  INDEX `fk_Patterns_PatternTypes_idx` (`type` ASC),
  INDEX `fk_Patterns_Patterns1_idx` (`parent` ASC),
  CONSTRAINT `fk_Patterns_PatternTypes`
    FOREIGN KEY (`type`)
    REFERENCES `mydb`.`PatternTypes` (`type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Patterns_Patterns1`
    FOREIGN KEY (`parent`)
    REFERENCES `mydb`.`Patterns` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Characteristics`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Characteristics` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Characteristics` (
  `type` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`type`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Unit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Unit` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Unit` (
  `type` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`type`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`PatternsCharacteristics`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`PatternsCharacteristics` ;

CREATE TABLE IF NOT EXISTS `mydb`.`PatternsCharacteristics` (
  `id` INT NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  `value` VARCHAR(45) NOT NULL,
  `minValue` VARCHAR(45) NOT NULL,
  `maxValue` VARCHAR(45) NOT NULL,
  `Unit_type` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`, `type`),
  INDEX `fk_Patterns_has_Characteristics_Characteristics1_idx` (`type` ASC),
  INDEX `fk_Patterns_has_Characteristics_Patterns1_idx` (`id` ASC),
  INDEX `fk_PatternsCharacteristics_Unit1_idx` (`Unit_type` ASC),
  CONSTRAINT `fk_Patterns_has_Characteristics_Patterns1`
    FOREIGN KEY (`id`)
    REFERENCES `mydb`.`Patterns` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Patterns_has_Characteristics_Characteristics1`
    FOREIGN KEY (`type`)
    REFERENCES `mydb`.`Characteristics` (`type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PatternsCharacteristics_Unit1`
    FOREIGN KEY (`Unit_type`)
    REFERENCES `mydb`.`Unit` (`type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
