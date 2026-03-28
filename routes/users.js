const express = require("express");
const router = express.Router();

const usersController = require("../controllers/userController");
const validate = require("../middleware/validate");
const { withErrorHandling } = require("../middleware/routeErrorHandler");

const isAuthenticated = require("../middleware/authenticate");

/*
  #swagger.tags = ['Users']
*/
router.get("/", withErrorHandling(usersController.getAllUsers));

/*
  #swagger.tags = ['Users']
*/
router.get("/:id", withErrorHandling(usersController.getUserById));

/*
  #swagger.tags = ['Users']
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $firstName: 'Drew',
      $lastName: 'Jezek',
      $email: 'drew@example.com',
      $password: 'StrongPassword123'
    }
  }
*/
router.post(
  "/",
  isAuthenticated,
  withErrorHandling(validate.saveUser),
  withErrorHandling(usersController.createUser),
);

/*
  #swagger.tags = ['Users']
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      $firstName: 'Drew',
      $lastName: 'Jezek',
      $email: 'drew@example.com',
      $password: 'StrongPassword123'
    }
  }
*/
router.put(
  "/:id",
  isAuthenticated,
  withErrorHandling(validate.saveUser),
  withErrorHandling(usersController.updateUser),
);

/*
  #swagger.tags = ['Users']
*/
router.delete(
  "/:id",
  isAuthenticated,
  withErrorHandling(usersController.deleteUser),
);

module.exports = router;
