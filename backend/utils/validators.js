const validateRegister = (data) => {
  const errors = {};

  const {
    name,
    username,
    email,
    password
  } = data;

  if (!name || !name.trim()) {
    errors.name = "Name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!username || !username.trim()) {
    errors.username = "Username is required";
  } else if (
    !/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())
  ) {
    errors.username =
      "Username must be 3-20 characters and contain only letters, numbers and underscore";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    )
  ) {
    errors.email = "Please enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password =
      "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateLogin = (data) => {
  const errors = {};

  const {
    email,
    password
  } = data;

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    )
  ) {
    errors.email = "Please enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validatePost = (data) => {
  const errors = {};

  const {
    content = "",
    visibility = "public"
  } = data;

  if (
    !content.trim() &&
    !data.hasFile
  ) {
    errors.content =
      "Post must contain text or media";
  }

  if (
    !["public", "private"].includes(
      visibility
    )
  ) {
    errors.visibility =
      "Invalid visibility";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateComment = (data) => {
  const errors = {};

  if (
    !data.content ||
    !data.content.trim()
  ) {
    errors.content =
      "Comment cannot be empty";
  }

  if (
    data.content &&
    data.content.trim().length > 1000
  ) {
    errors.content =
      "Comment cannot exceed 1000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateMessage = (data) => {
  const errors = {};

  if (!data.receiverId) {
    errors.receiverId =
      "Receiver is required";
  }

  if (
    (!data.content ||
      !data.content.trim()) &&
    !data.hasFile
  ) {
    errors.content =
      "Message cannot be empty";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePost,
  validateComment,
  validateMessage
};