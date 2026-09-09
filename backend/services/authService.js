const User = require("../models/User");
const {
  hashPassword,
  comparePassword
} = require("../utils/passwordUtils");

const generateToken = require("../utils/generateToken");

const registerUser = async (userData) => {
  const {
    name,
    username,
    email,
    password,
    phone = "",
    bio = ""
  } = userData;

  const cleanEmail = email.toLowerCase().trim();
  const cleanUsername = username.toLowerCase().trim();

  const existingUser = await User.findOne({
    $or: [
      { email: cleanEmail },
      { username: cleanUsername }
    ]
  });

  if (existingUser) {
    if (existingUser.email === cleanEmail) {
      const error = new Error("Email already registered");
      error.statusCode = 409;
      throw error;
    }

    const error = new Error("Username already taken");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name: name.trim(),
    username: cleanUsername,
    email: cleanEmail,
    password: hashedPassword,
    phone: phone.trim(),
    bio: bio.trim()
  });

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      phone: user.phone,
      role: user.role
    }
  };
};

const loginUser = async (email, password) => {
  const cleanEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: cleanEmail
  }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Your account is deactivated");
    error.statusCode = 403;
    throw error;
  }

  const passwordMatch = await comparePassword(
    password,
    user.password
  );

  if (!passwordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      phone: user.phone,
      role: user.role
    }
  };
};

const getUserById = async (userId) => {
  return await User.findById(userId).select("-password");
};

module.exports = {
  registerUser,
  loginUser,
  getUserById
};