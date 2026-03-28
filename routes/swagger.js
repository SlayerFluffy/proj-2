const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger-output.json");
const { handleRouteError } = require("../middleware/routeErrorHandler");

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", async (req, res, next) => {
  try {
    const swaggerHandler = swaggerUi.setup(swaggerDocument);
    return swaggerHandler(req, res, next);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

module.exports = router;
