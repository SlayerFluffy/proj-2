const express = require("express");
const router = express.Router();

const usersController = require("../controllers/userController");
const validate = require("../middleware/validate");
const { withErrorHandling } = require("../middleware/routeErrorHandler");

router.get("/", withErrorHandling(usersController.getAllUsers));

router.get("/:id", withErrorHandling(usersController.getUserById));

router.post(
  "/",
  withErrorHandling(validate.saveUser),
  withErrorHandling(usersController.createUser),
);

router.put(
  "/:id",
  withErrorHandling(validate.saveUser),
  withErrorHandling(usersController.updateUser),
);

router.delete("/:id", withErrorHandling(usersController.deleteUser));

module.exports = router;
