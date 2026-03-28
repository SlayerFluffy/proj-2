const router = require("express").Router();
const express = require("express");
const { handleRouteError } = require("../middleware/routeErrorHandler");
const passport = require('passport');

router.use("/", require("./swagger"));

router.get("/", async (req, res) => {
  try {
    //#swagger.tags=['Hello World']
    res.send("Hello World!");
  } catch (error) {
    handleRouteError(res, error);
  }
});

router.use("/characters", require("./characters"));
router.use("/users", require("./users"));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
