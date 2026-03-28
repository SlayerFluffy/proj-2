const express = require("express");
const router = express.Router();

const charactersController = require("../controllers/characterController");
const validate = require("../middleware/validate");
const { withErrorHandling } = require("../middleware/routeErrorHandler");

const isAuthenticated = require("../middleware/authenticate");

/*
  #swagger.tags = ['Characters']
*/
router.get("/", withErrorHandling(charactersController.getAllCharacters));

/*
  #swagger.tags = ['Characters']
*/
router.get("/:id", withErrorHandling(charactersController.getCharacterById));

/*
  #swagger.tags = ['Characters']
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $charName: 'Arannis',
      $charRace: 'Elf',
      $charClass: 'Ranger',
      $charLevel: 5,
      $charAlignment: 'Neutral Good',
      $charBackground: 'Outlander',
      charAge: 120,
      charHeight: 72,
      charWeight: 160,
      charEyes: 'Green',
      charSkin: 'Fair',
      charBonds: 'Protect my homeland',
      charFlaws: 'Too trusting',
      charIdeals: 'Freedom',
      charPersonalityTraits: 'Calm under pressure',
      $hp: 42,
      $ac: 16,
      $str: 14,
      $dex: 17,
      $con: 13,
      $int: 12,
      $wis: 15,
      $cha: 10
    }
  }
*/
router.post(
  "/",
  isAuthenticated,
  withErrorHandling(validate.saveCharacter),
  withErrorHandling(charactersController.createCharacter),
);

/*
  #swagger.tags = ['Characters']
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $charName: 'Arannis',
      $charRace: 'Elf',
      $charClass: 'Ranger',
      $charLevel: 5,
      $charAlignment: 'Neutral Good',
      $charBackground: 'Outlander',
      charAge: 120,
      charHeight: 72,
      charWeight: 160,
      charEyes: 'Green',
      charSkin: 'Fair',
      charBonds: 'Protect my homeland',
      charFlaws: 'Too trusting',
      charIdeals: 'Freedom',
      charPersonalityTraits: 'Calm under pressure',
      $hp: 42,
      $ac: 16,
      $str: 14,
      $dex: 17,
      $con: 13,
      $int: 12,
      $wis: 15,
      $cha: 10
    }
  }
*/
router.put(
  "/:id",
  isAuthenticated,
  withErrorHandling(validate.saveCharacter),
  withErrorHandling(charactersController.updateCharacter),
);

/*
  #swagger.tags = ['Characters']
*/
router.delete(
  "/:id",
  isAuthenticated,
  withErrorHandling(charactersController.deleteCharacter),
);

module.exports = router;
