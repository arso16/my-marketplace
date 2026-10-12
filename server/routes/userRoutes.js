
const express = require("express");

const {
    registerUser,
    loginUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getMe,
    updateSellerContact,
    getPublicSellerProfile,
    getSellerProducts
} = require("../controllers/userController");

const {
    addFavorite,
    getFavorites,
    removeFavorite
} = require("../controllers/favoriteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/seller/contact", authMiddleware, updateSellerContact);

router.get("/sellers/:id", getPublicSellerProfile);

router.get("/sellers/:id/products", getSellerProducts);

router.get("/me", authMiddleware, getMe);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify-email", verifyEmail);

router.get("/favorites", authMiddleware, getFavorites);

router.post("/favorites/:productId", authMiddleware, addFavorite);

router.delete("/favorites/:productId", authMiddleware, removeFavorite);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;