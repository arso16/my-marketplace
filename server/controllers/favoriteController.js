
const User = require("../models/user");
const Product = require("../models/product");
const mongoose = require("mongoose");

const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate("favorites");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user.favorites);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const addFavorite = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.favorites.some(
            (id) => id.toString() === productId
        )) {
            return res.status(400).json({
                message: "Product is already in favorites"
            });
        }

        user.favorites.push(product._id);
        await user.save();

        res.status(200).json({
            message: "Product added to favorites"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.favorites = user.favorites.filter(
            (id) => id.toString() !== productId
        );

        await user.save();

        res.status(200).json({
            message: "Product removed from favorites"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite
};