import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { config } from '../config/env.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
  const { email, password, nome } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'Email já está registrado');
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

  // Create user
  const user = await User.create({
    email,
    password_hash,
    nome,
  });

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);

  res.status(201).json({
    success: true,
    message: 'Usuário registrado com sucesso',
    data: {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      accessToken,
      refreshToken,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Email ou senha incorretos');
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new ApiError(401, 'Email ou senha incorretos');
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);

  res.json({
    success: true,
    message: 'Login realizado com sucesso',
    data: {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      accessToken,
      refreshToken,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token é obrigatório');
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = 
      generateTokens(user.id, user.role);

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    throw new ApiError(401, 'Refresh token inválido ou expirado');
  }
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password_hash'] },
  });

  if (!user) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  res.json({
    success: true,
    data: user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  // In a simple setup, logout is handled on the client
  // by removing the token. For more security, implement token blacklist.
  res.json({
    success: true,
    message: 'Logout realizado com sucesso',
  });
});
