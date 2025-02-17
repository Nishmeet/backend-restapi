const errorHandler = (err, req, res, next) => {
  // Log error stack trace to console
  console.error(err.stack);


 

  if (err.code === 'INVALID_ARGUMENT') {
    return res.status(400).json({
      message: 'Invalid data provided',
      error: err.message
    });
  }

  // Default error response
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
};

module.exports = errorHandler; 