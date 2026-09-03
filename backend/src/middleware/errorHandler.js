const errorHandler = (err, req, res, next) => {
  console.error('⚠️ [Server Error]:', err.stack || err.message || err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal error occurred on the clinical research server.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

module.exports = errorHandler;
