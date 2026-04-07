import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError, asyncHandler } from './errorHandler.js';

export const authenticate = asyncHandler((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new ApiError(401, 'No token provided');
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired');
    }
    throw new ApiError(401, 'Invalid token');
  }
});

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Missing authentication',
        statusCode: 401,
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        statusCode: 403,
      });
    }

    next();
  };
};

export const optional = (middleware) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Token invalid but we continue
    }
    next();
  };
};
