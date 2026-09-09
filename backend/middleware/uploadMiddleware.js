const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ======================================
// CREATE UPLOAD DIRECTORY
// ======================================
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true
    });
  }
};


// ======================================
// UPLOAD DIRECTORIES
// ======================================
const uploadRoot = path.join(
  __dirname,
  "../uploads"
);

const postDir = path.join(
  uploadRoot,
  "posts"
);

const chatDir = path.join(
  uploadRoot,
  "chat"
);

const profileDir = path.join(
  uploadRoot,
  "profile"
);

createUploadDir(postDir);
createUploadDir(chatDir);
createUploadDir(profileDir);


// ======================================
// STORAGE
// ======================================
const createStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.extname(file.originalname)}`;

      cb(null, uniqueName);
    }
  });
};


// ======================================
// FILE FILTER
// ======================================
const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/mpeg",
    "video/webm",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type"
      ),
      false
    );
  }
};


// ======================================
// POST UPLOAD
// ======================================
const postUpload = multer({
  storage: createStorage(postDir),
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
}).fields([
  {
    name: "image",
    maxCount: 1
  },
  {
    name: "video",
    maxCount: 1
  }
]);


// ======================================
// CHAT UPLOAD
// ======================================
const chatUpload = multer({
  storage: createStorage(chatDir),
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
}).single("file");


// ======================================
// PROFILE UPLOAD
// ======================================
const profileUpload = multer({
  storage: createStorage(profileDir),
  fileFilter: (
    req,
    file,
    cb
  ) => {
    const allowedImages = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif"
    ];

    if (
      allowedImages.includes(
        file.mimetype
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed for profile picture"
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single("profilePicture");


// ======================================
// EXPORTS
// ======================================
module.exports = {
  uploadPost: postUpload,
  uploadChat: chatUpload,
  uploadProfile: profileUpload
};