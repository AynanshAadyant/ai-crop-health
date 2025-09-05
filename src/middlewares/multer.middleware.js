import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

function uploadFiles(req, res, next) {
  upload.any()(req, res, function (err) {
    if (err) {
      // Handle Multer errors
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

module.exports = uploadFiles;
