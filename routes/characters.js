const express = require("express");
const router = express.Router();

const charactersController = require("../controllers/characterController");
const validate = require("../middleware/validate");
const { withErrorHandling } = require("../middleware/routeErrorHandler");

router.get("/", withErrorHandling(charactersController.getAllCharacters));

router.get("/:id", withErrorHandling(charactersController.getCharacterById));

router.post(
  "/",
  withErrorHandling(validate.saveCharacter),
  withErrorHandling(charactersController.createCharacter),
);

router.put(
  "/:id",
  withErrorHandling(validate.saveCharacter),
  withErrorHandling(charactersController.updateCharacter),
);

router.delete("/:id", withErrorHandling(charactersController.deleteCharacter));

module.exports = router;
