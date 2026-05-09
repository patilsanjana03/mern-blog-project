const multer = require('multer');
const path = require('path');

// STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// ✅ FIXED FILE FILTER (IMAGES + DOCS)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // 🔥 IMAGES (IMPORTANT)
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',

    // DOCUMENTS
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log("❌ REJECTED FILE TYPE:", file.mimetype); // debug
    cb(new Error('Invalid file type'), false);
  }
};

// LIMITS
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;