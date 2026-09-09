const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==========================================
// UPLOAD DIRECTORY
// ==========================================

const uploadDir = path.join(
  __dirname,
  "../uploads/chat"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ==========================================
// STORAGE
// ==========================================

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(null, uploadDir);
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const ext =
        path.extname(
          file.originalname
        );

      const name =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${ext}`;

      cb(null, name);
    },
  });

// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowed = [
    "image/",
    "video/",
  ];

  const isAllowed =
    allowed.some((type) =>
      file.mimetype.startsWith(type)
    );

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image and video files are allowed"
      ),
      false
    );
  }
};

// ==========================================
// MULTER
// ==========================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:
      20 * 1024 * 1024,
  },
});

module.exports = upload;