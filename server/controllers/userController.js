
const User = require("../models/user");
const Product = require("../models/product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../emailService");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender, profilePicture } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "name, email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "password must be at least 6 characters long"
            });
        }

        const selectedGender = gender || "male";

        if (!["male", "female"].includes(selectedGender)) {
            return res.status(400).json({
                message: "gender must be male or female"
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = crypto.randomInt(100000, 1000000).toString();

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            gender: selectedGender,
            profilePicture: profilePicture || "",
            role: "user",
            isEmailVerified: false,
            emailVerificationCode: verificationCode,
            emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000)
        });

        try {
            await sendEmail({
                to: user.email,
                subject: "Verify your My Marketplace account",
                text: `Your verification code is ${verificationCode}. It expires in 10 minutes.`
            });
        } catch (emailError) {
            console.error("Verification email failed:", emailError.message);
            
            await User.findByIdAndDelete(user._id);

            return res.status(502).json({
                message: "Could not send the verification email. Please try again."
            });
        }

        return res.status(201).json({
            message: "Registration started. Check your email for the verification code.",
            email: user.email
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "email already registered"
            });
        }

        return res.status(500).json({
            message: "Something went wrong during registration"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "invalid email or password"
            });
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "invalid email or password"
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in."
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "user logged in successfully",
            token
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong during login"
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (
            typeof email !== "string" ||
            typeof code !== "string" ||
            !email.trim() ||
            !/^\d{6}$/.test(code.trim())
        ) {
            return res.status(400).json({
                message: "A valid email and six-digit verification code are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or verification code"
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                message: "This email is already verified"
            });
        }

        if (
            user.emailVerificationCode !== code.trim() ||
            !user.emailVerificationExpires ||
            user.emailVerificationExpires.getTime() < Date.now()
        ) {
            return res.status(400).json({
                message: "Invalid or expired verification code"
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = null;
        user.emailVerificationExpires = null;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully. You can now log in."
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong during email verification"
        });
    }
};

const addFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        if (user.favorites.some(id => id.toString() === productId)) {
            return res.status(400).json({
                message: "product is in favorites"
            });
        }

        user.favorites.push(productId);
        await user.save();

        return res.status(200).json({
            message: "product added to favorites"
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("favorites");

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        return res.status(200).json(user.favorites);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        const favoriteExists = user.favorites.some(
            id => id.toString() === productId
        );

        if (!favoriteExists) {
            return res.status(404).json({
                message: "product is not in favorites"
            });
        }

        user.favorites = user.favorites.filter(
            id => id.toString() !== productId
        );

        await user.save();

        return res.status(200).json({
            message: "product removed from favorites"
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(200).json({
                message: "If an account exists for this email, a reset link will be sent."
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                to: user.email,
                subject: "Reset your My Marketplace password",
                text: `Hello ${user.name},\n\nTo reset your password, open this link:\n${resetLink}\n\nThis link expires in 15 minutes. If you did not request a password reset, you can ignore this email.`
            });
        } catch (emailError) {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            return res.status(502).json({
                message: "Could not send the reset email. Please try again."
            });
        }

        return res.status(200).json({
            message: "If an account exists for this email, a reset link will be sent."
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while requesting a password reset"
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (
            typeof token !== "string" ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                message: "Token and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset link"
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while resetting the password"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("name email gender profilePicture phoneNumber instagram facebook")

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while loading your profile"
        });
    }
};


const updateSellerContact = async (req, res) => {
    try {
        const { phoneNumber, instagram, facebook } = req.body;

        const phone = typeof phoneNumber === "string"
            ? phoneNumber.trim()
            : "";

        const instagramValue = typeof instagram === "string"
            ? instagram.trim()
            : "";

        const facebookValue = typeof facebook === "string"
            ? facebook.trim()
            : "";

        if (!phone && !instagramValue && !facebookValue) {
            return res.status(400).json({
                message: "Provide at least one contact method"
            });
        }

        const isValidUrl = (value) => {
            try {
                const url = new URL(value);
                return url.protocol === "https:" || url.protocol === "http:";
            } catch {
                return false;
            }
        };

        let instagramUrl = instagramValue;
        let facebookUrl = facebookValue;

        if (instagramUrl && !instagramUrl.startsWith("http")) {
            instagramUrl = `https://www.instagram.com/${instagramUrl.replace(/^@/, "")}/`;
        }

        if (facebookUrl && !facebookUrl.startsWith("http")) {
            return res.status(400).json({
                message: "Enter a valid Facebook profile URL"
            });
        }

        if (instagramUrl && !isValidUrl(instagramUrl)) {
            return res.status(400).json({
                message: "Enter a valid Instagram profile URL or username"
            });
        }

        if (facebookUrl && !isValidUrl(facebookUrl)) {
            return res.status(400).json({
                message: "Enter a valid Facebook profile URL"
            });
        }

        if (phone && !/^[+()\d\s-]{7,25}$/.test(phone)) {
            return res.status(400).json({
                message: "Enter a valid phone number"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                phoneNumber: phone,
                instagram: instagramUrl,
                facebook: facebookUrl
            },
            {
                new: true,
                runValidators: true
            }
        ).select("name phoneNumber instagram facebook");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Contact details saved",
            user
        });
    } catch (err) {
        return res.status(500).json({
            message: "Could not update contact details"
        });
    }
};

const getPublicSellerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(
            "name profilePicture phoneNumber instagram facebook"
        );

        if (!user) {
            return res.status(404).json({
                message: "Seller not found"
            });
        }

        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid seller ID"
        });
    }
};


const getSellerProducts = async (req, res) => {
    try {
        const seller = await User.findById(req.params.id).select("_id");

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found"
            });
        }

        const products = await Product.find({
            user: seller._id
        }).sort({ _id: -1 });

        return res.status(200).json(products);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid seller ID"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    addFavorite,
    getFavorites,
    removeFavorite,
    forgotPassword,
    resetPassword,
    getMe,
    updateSellerContact,
    getPublicSellerProfile,
    getSellerProducts
};
