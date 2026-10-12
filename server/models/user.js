
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    resetPasswordToken: {
        type: String,
        default: null
    },

    resetPasswordExpires: {
        type: Date,
        default: null
    },

    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male"
    },

    profilePicture: {
        type: String,
        default: ""
    },

    phoneNumber: {
        type: String,
        trim: true,
        default: ""
    },

    instagram: {
        type: String,
        trim: true,
        default: ""
    },

    facebook: {
        type: String,
        trim: true,
        default: ""
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    emailVerificationCode: {
        type: String,
        default: null
    },

    emailVerificationExpires: {
        type: Date,
        default: null
    },

    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;