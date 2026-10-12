const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const now = new Date();
    
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
    
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
    
        const extension = path.extname(file.originalname);
    
        const filename =
            `${year}-${month}-${day}-${hours}-${minutes}-${seconds}${extension}`;
    
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;