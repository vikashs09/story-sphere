const {
  registerUser,
  loginUser
} = require("../services/authService");

const {
  validateRegister,
  validateLogin
} = require("../utils/validators");

const {
  sendSuccess,
  sendError
} = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const validation = validateRegister(req.body);

    if (!validation.isValid) {
      return sendError(
        res,
        400,
        "Please fix the validation errors",
        validation.errors
      );
    }

    const result = await registerUser(req.body);

    return sendSuccess(
      res,
      201,
      "Registration successful",
      result
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validation = validateLogin(req.body);

    if (!validation.isValid) {
      return sendError(
        res,
        400,
        "Please fix the validation errors",
        validation.errors
      );
    }

    const { email, password } = req.body;

    const result = await loginUser(
      email,
      password
    );

    return sendSuccess(
      res,
      200,
      "Login successful",
      result
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  return sendSuccess(
    res,
    200,
    "Logout successful"
  );
};

module.exports = {
  register,
  login,
  logout
};