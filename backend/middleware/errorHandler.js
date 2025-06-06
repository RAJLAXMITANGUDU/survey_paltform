export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const errors = err.errors || undefined; 
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}