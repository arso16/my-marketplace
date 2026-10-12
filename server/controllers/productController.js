const mongoose = require("mongoose")
const Product = require("../models/product")

const createProduct = async (req, res, next) => {
    try {
        const {
            title,
            description,
            price,
            currency,
            category,
            condition
        } = req.body;

        const image = req.file
            ? `/uploads/${req.file.filename}`
            : req.body.image;

        const product = await Product.create({
            title,
            description,
            price,
            currency: currency || "AMD",
            category,
            condition,
            image,
            user: req.userId
        });

        res.status(201).json(product);

    } catch (err) {
        next(err);
    }
};

const getProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(req.params.id)
            .populate("user", "_id name email phoneNumber instagram facebook profilePicture");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const {
            title,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 5
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (!Number.isInteger(pageNumber) || pageNumber < 1) {
            return res.status(400).json({
                message: "Page must be a positive integer"
            });
        }

        if (!Number.isInteger(limitNumber) || limitNumber < 1) {
            return res.status(400).json({
                message: "Limit must be a positive integer"
            });
        }

        if (minPrice !== undefined && isNaN(Number(minPrice))) {
            return res.status(400).json({
                message: "minPrice must be a number"
            });
        }

        if (maxPrice !== undefined && isNaN(Number(maxPrice))) {
            return res.status(400).json({
                message: "maxPrice must be a number"
            });
        }

        const filter = {};

        if (title) {
            filter.title = {
                $regex: title,
                $options: "i"
            };
        }

        if (category) {
            filter.category = {
                $regex: category,
                $options: "i"
            };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        let query = Product.find(filter);

        if (sort === "price") {
            query = query.sort({ price: 1 });
        }

        if (sort === "-price") {
            query = query.sort({ price: -1 });
        }

        const total = await Product.countDocuments(filter);

        const products = await query
            .populate("user", "_id")
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        return res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
            products
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
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

        if (product.user.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only edit your own products"
            });
        }

        product.title = req.body.title;
        product.description = req.body.description;
        product.price = req.body.price;
        product.category = req.body.category;
        product.condition = req.body.condition;

        if (req.file) {
            product.image = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            product.image = req.body.image;
        }

        await product.save();

        res.status(200).json(product);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
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

        if (product.user.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own products"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

const addReview = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const { rating, comment } = req.body;

        if (!rating) {
            return res.status(400).json({
                message: "rating is required"
            })
        }

        const product = await Product.findById(req.params.id)
            .populate("reviews.user", "name email");

        if (!product) {
            return res.status(404).json({
                message: "product not found"
            })
        }

        const alreadyReviewed = product.reviews.some(
            review => review.user.toString() === req.userId.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                message: "You have already reviewed this product"
            });
        }

        product.reviews.push({
            user: req.userId,
            rating, comment
        })

        await product.save();

        res.status(201).json({
            message: "review added successfully",
            product
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const getReviews = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(req.params.id)
            .populate("reviews.user", "name email");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product.reviews);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const updateReview = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
            return res.status(400).json({
                message: "Invalid review ID"
            });
        }

        const { rating, comment } = req.body;

        if (!rating) {
            return res.status(400).json({
                message: "rating is required"
            })
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "rating must be between 1 and 5"
            })
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "product not found"
            })
        }

        const review = product.reviews.id(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                message: "review not found"
            })
        }

        if (review.user.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only edit your own review"
            })
        }

        review.rating = rating;
        review.comment = comment;

        await product.save();

        res.status(200).json({
            message: "review updated successfully",
            review
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

const deleteReview = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
            return res.status(400).json({
                message: "Invalid review ID"
            });
        }
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const review = product.reviews.id(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        if (review.user.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own review"
            });
        }

        review.deleteOne();

        await product.save();

        res.status(200).json({
            message: "Review deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    addReview,
    getReviews,
    updateReview,
    deleteReview
}