const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    currency: {
        type: String,
        enum: ["AMD", "USD", "EUR", "RUB"],
        default: "AMD"
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    condition: {
        type: String,
        required: true,
        enum: ["new", "used"]
    },

    image: {
        type: String,
        default: ""
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },

            comment: {
                type: String,
                trim: true
            }
        }
    ]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;