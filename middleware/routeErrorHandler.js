const handleRouteError = (res, error) => {
  if (res.headersSent) {
    return;
  }

  const isBadRequest = error?.status === 400 || error?.statusCode === 400;
  const statusCode = isBadRequest ? 400 : 500;

  res.status(statusCode).json({
    message:
      error?.message ||
      (isBadRequest
        ? "Bad request."
        : "Internal server error while processing request."),
  });
};

const withErrorHandling = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    handleRouteError(res, error);
  }
};

module.exports = {
  handleRouteError,
  withErrorHandling,
};
