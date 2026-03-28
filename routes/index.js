const router = require("express").Router();
const express = require("express");
const { handleRouteError } = require("../middleware/routeErrorHandler");

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

module.exports = router;
