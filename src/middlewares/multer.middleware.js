import mutler from "multer";
// Configure storage (optional, you can customize destination and filename)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder to save uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Initialize upload
const upload = multer({ storage });

// Middleware to handle multiple file uploads
function uploadFiles(req, res, next) {
  // Use .any() to accept files from any field
  upload.any()(req, res, function (err) {
    if (err) {
      // Handle Multer errors
      return res.status(400).json({ error: err.message });
    }
    // Files are now available in req.files
    next();
  });
}

module.exports = uploadFiles;
