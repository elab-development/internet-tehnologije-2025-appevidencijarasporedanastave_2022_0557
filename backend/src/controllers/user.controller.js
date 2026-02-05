import * as userService from "../services/user.service.js";
import { success, error } from "../utils/response.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    return success(res, users, "Users fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return success(res, user, "User created successfully", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    return success(res, user, "Profile fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const updateMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await userService.updateUser(userId, req.body);

    return success(res, updatedUser, "Account updated successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await userService.updateUser(id, req.body);

    return success(res, updatedUser, "User updated successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const deleteAccount = async (req, res) => {
  try {
    console.log("DELETE user id:", req.params.id);

    await userService.deleteUser(req.params.id);

    return success(res, null, "Account deleted successfully");
  } catch (err) {
    return error(res, err.message, 400);
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { role, name } = req.query;

    if (!role) {
      return error(res, "Role is required", 400);
    }

    const users = await userService.searchUsers({ role, name });

    return success(res, users, "Users fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};
