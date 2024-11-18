
import multer from 'multer'
import path from 'path'
// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

export {upload}

// import multer from 'multer';
// import path from 'path';
// // import { fileURLToPath } from 'url';

// // Set up storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // const __filename = fileURLToPath(import.meta.url);
//     const uploadPath = path.join(process.cwd(), 'public', 'images');
    
//     // Log the full path where the file is being uploaded to
//     console.log('Upload path:', uploadPath);
    
//     // Make sure the 'public/images' folder exists
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
    
//     // Log the filename to ensure it's correct
//     console.log('Generated filename:', filename);
    
//     cb(null, filename);
//   }
// });

// // Create the multer instance
// const upload = multer({ storage: storage });

// export { upload };
