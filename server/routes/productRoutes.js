const express = require("express");

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    addReview,
    getReviews,
    updateReview,
    deleteReview
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();

const upload = require("../middleware/upload");

router.post("/", authMiddleware, upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", authMiddleware, upload.single("image"), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

router.post("/:id/reviews", authMiddleware, addReview);

router.get("/:id/reviews", getReviews);

router.put("/:id/reviews/:reviewId", authMiddleware, updateReview);

router.delete("/:id/reviews/:reviewId", authMiddleware, deleteReview);

module.exports = router;