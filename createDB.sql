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
  `idPattern` INT NOT NULL AUTO_INCREMENT,
  `pType` VARCHAR(20) NOT NULL,
  `idParent` INT NULL,
  `weigth` INT NOT NULL,
  PRIMARY KEY (`idPattern`, `pType`),
  INDEX `fk_Patterns_PatternTypes_idx` (`pType` ASC),
  INDEX `fk_Patterns_Patterns1_idx` (`idParent` ASC),
  CONSTRAINT `fk_Patterns_PatternTypes`
    FOREIGN KEY (`pType`)
    REFERENCES `mydb`.`PatternTypes` (`type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Patterns_Patterns1`
    FOREIGN KEY (`idParent`)
    REFERENCES `mydb`.`Patterns` (`idPattern`)
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
-- Table `mydb`.`PatternsCharacteristics`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`PatternsCharacteristics` ;

CREATE TABLE IF NOT EXISTS `mydb`.`PatternsCharacteristics` (
  `idP` INT NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  `value` VARCHAR(45) NULL,
  `minValue` VARCHAR(45) NULL,
  `maxValue` VARCHAR(45) NULL,
  PRIMARY KEY (`idP`, `type`),
  INDEX `fk_Patterns_has_Characteristics_Characteristics1_idx` (`type` ASC),
  INDEX `fk_Patterns_has_Characteristics_Patterns1_idx` (`idP` ASC),
  CONSTRAINT `fk_Patterns_has_Characteristics_Patterns1`
    FOREIGN KEY (`idP`)
    REFERENCES `mydb`.`Patterns` (`idPattern`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Patterns_has_Characteristics_Characteristics1`
    FOREIGN KEY (`type`)
    REFERENCES `mydb`.`Characteristics` (`type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;