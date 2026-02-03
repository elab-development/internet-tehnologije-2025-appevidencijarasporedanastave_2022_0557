import { error } from "../utils/response.js";

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return error(res, "Forbidden – admin access only", 403);
  }
  next();
};
