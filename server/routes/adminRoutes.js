
const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


router.post("/password-check", (req, res) => {
    const { password } = req.body;

    if (!process.env.ADMIN_PASSWORD) {
        return res.status(500).json({
            message: "Admin password is not configured"
        });
    }

    if (
        typeof password !== "string" ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            message: "Incorrect admin password"
        });
    }

    return res.status(200).json({
        message: "Admin password accepted"
    });
});

router.use(authMiddleware, adminMiddleware);

router.get("/users", async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -resetPasswordToken -emailVerificationCode -emailChangeCode");

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: "Could not retrieve users"
        });
    }
});

router.get("/products", async (req, res) => {
    try {
        const products = await Product.find()
            .populate("user", "name email");

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({
            message: "Could not retrieve products"
        });
    }
});


router.patch("/products/:id", async (req, res) => {
    try {
        const mongoose = require("mongoose");

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const { price, currency } = req.body;
        const updates = {};

        if (price !== undefined) {
            const numericPrice = Number(price);

            if (!Number.isFinite(numericPrice) || numericPrice < 0) {
                return res.status(400).json({
                    message: "Price must be a non-negative number"
                });
            }

            updates.price = numericPrice;
        }

        if (currency !== undefined) {
            const allowedCurrencies = ["AMD", "USD", "EUR", "RUB"];

            if (!allowedCurrencies.includes(currency)) {
                return res.status(400).json({
                    message: "Invalid currency"
                });
            }

            updates.currency = currency;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Provide a price or currency to update"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate("user", "name email");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({
            message: "Could not update product"
        });
    }
});


router.delete("/products/:id", async (req, res) => {
    try {
        const mongoose = require("mongoose");

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.deleteOne();

        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Could not delete product"
        });
    }
});


router.delete("/users/:id", async (req, res) => {
    try {
        const mongoose = require("mongoose");

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        if (req.params.id === req.userId) {
            return res.status(400).json({
                message: "You cannot delete your own admin account"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await user.deleteOne();

        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Could not delete user"
        });
    }
});


module.exports = router;
