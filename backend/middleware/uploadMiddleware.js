const multer = require('multer');
const path = require('path');

// Configure local storage (for development)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure you create an 'uploads' folder in your backend root!
  },
  filename: function (req, file, cb) {
    // Creates a unique filename: timestamp-originalName
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Filter to only allow specific document types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf', // PDF
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-excel', // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'text/plain' // TXT
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word, Excel, and TXT are allowed.'), false);
  }
};

// Maximum file size: 5MB
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;