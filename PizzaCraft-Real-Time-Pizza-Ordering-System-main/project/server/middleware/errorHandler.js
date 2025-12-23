export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Supabase errors
  if (error.code) {
    return res.status(400).json({
      error: error.message || 'Database error',
      code: error.code
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: error.errors
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
};