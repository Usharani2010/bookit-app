import multer from 'multer';

// We don't need disk storage anymore since we'll store in MongoDB
const storage = multer.memoryStorage(); // Store file in memory as Buffer

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit (Base64 increases size by ~33%)
  }
});

export default upload;