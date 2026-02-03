import * as authService from '../services/auth.service.js';
import { success, error } from '../utils/response.js'
import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }

    const user = await authService.loginUser(email, password);

    const token = generateToken({
      id: user.id,
      role: user.role
    });

    return success(res, { user, token }, 'Login successful');
  } catch (err) {
    return error(res, err.message, 401);
  }
};

export const logout = async (req, res) => {
  return success(res, null, 'Logout successful');
};
