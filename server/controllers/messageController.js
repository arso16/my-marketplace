
const mongoose = require("mongoose");
const Message = require("../models/message");
const Product = require("../models/product");

const sendMessage = async (req, res) => {
    try {
        const { receiver, product, text } = req.body;
        const senderId = req.userId;

        if (
            !mongoose.Types.ObjectId.isValid(receiver) ||
            !mongoose.Types.ObjectId.isValid(product)
        ) {
            return res.status(400).json({
                message: "Invalid receiver or product ID"
            });
        }

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                message: "Message text is required"
            });
        }

        if (text.trim().length > 2000) {
            return res.status(400).json({
                message: "Message cannot exceed 2000 characters"
            });
        }

        if (senderId.toString() === receiver.toString()) {
            return res.status(400).json({
                message: "You cannot message yourself"
            });
        }

        const item = await Product.findById(product);

        if (!item) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (!item.user) {
            return res.status(400).json({
                message: "Product has no seller"
            });
        }

        const sellerId = item.user.toString();
        const senderIsSeller = senderId.toString() === sellerId;
        const receiverIsSeller = receiver.toString() === sellerId;

        if (!senderIsSeller && !receiverIsSeller) {
            return res.status(403).json({
                message: "Messages must involve this product's seller"
            });
        }

        if (senderIsSeller) {
            const existingConversation = await Message.exists({
                product,
                sender: receiver,
                receiver: senderId
            });

            if (!existingConversation) {
                return res.status(403).json({
                    message: "The buyer must message you first"
                });
            }
        }

        const message = await Message.create({
            sender: senderId,
            receiver,
            product,
            text: text.trim(),
            read: false
        });

        await message.populate("sender", "name profilePicture");
        await message.populate("receiver", "name profilePicture");
        await message.populate("product", "title image");

        return res.status(201).json(message);
    } catch (err) {
        console.error("sendMessage error:", err);

        return res.status(500).json({
            message: "Failed to send message"
        });
    }
};

const getConversation = async (req, res) => {
    try {
        const { productId, sellerId } = req.params;
        const buyerId = req.query.buyer;
        const currentUserId = req.userId;

        if (
            !mongoose.Types.ObjectId.isValid(productId) ||
            !mongoose.Types.ObjectId.isValid(sellerId)
        ) {
            return res.status(400).json({
                message: "Invalid product or seller ID"
            });
        }

        const item = await Product.findById(productId);

        if (!item) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (
            !item.user ||
            item.user.toString() !== sellerId.toString()
        ) {
            return res.status(400).json({
                message: "Seller does not match this product"
            });
        }

        const currentUserIsSeller =
            currentUserId.toString() === sellerId.toString();

        let otherUserId;

        if (currentUserIsSeller) {
            if (
                !buyerId ||
                !mongoose.Types.ObjectId.isValid(buyerId)
            ) {
                return res.status(400).json({
                    message: "Buyer ID is required for seller conversations"
                });
            }

            otherUserId = buyerId;
        } else {
            otherUserId = sellerId;
        }

        const conversationFilter = {
            product: productId,
            $or: [
                {
                    sender: currentUserId,
                    receiver: otherUserId
                },
                {
                    sender: otherUserId,
                    receiver: currentUserId
                }
            ]
        };

        const hasConversation = await Message.exists(conversationFilter);

        if (!hasConversation) {
            return res.status(403).json({
                message: "Send a message to start this conversation"
            });
        }

        const messages = await Message.find(conversationFilter)
            .populate("sender", "name profilePicture")
            .populate("receiver", "name profilePicture")
            .sort({ createdAt: 1 });

        await Message.updateMany(
            {
                product: productId,
                sender: otherUserId,
                receiver: currentUserId,
                read: false
            },
            {
                $set: { read: true }
            }
        );

        return res.status(200).json(messages);
    } catch (err) {
        console.error("getConversation error:", err);

        return res.status(500).json({
            message: "Failed to load conversation"
        });
    }
};

const getInbox = async (req, res) => {
    try {
        const currentUserId = new mongoose.Types.ObjectId(
            req.userId.toString()
        );

        const latestMessages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: currentUserId },
                        { receiver: currentUserId }
                    ]
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $group: {
                    _id: {
                        product: "$product",
                        sender: {
                            $cond: [
                                { $eq: ["$sender", currentUserId] },
                                "$receiver",
                                "$sender"
                            ]
                        }
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            {
                $sort: {
                    "lastMessage.createdAt": -1
                }
            }
        ]);

        const inbox = await Promise.all(
            latestMessages.map(async (entry) => {
                const lastMessage = entry.lastMessage;

                const [product, otherUser, unreadCount] = await Promise.all([
                    Product.findById(lastMessage.product).select(
                        "title image user"
                    ),
                    require("../models/user")
                        .findById(entry._id.sender)
                        .select("name profilePicture"),
                    Message.countDocuments({
                        product: lastMessage.product,
                        sender: entry._id.sender,
                        receiver: currentUserId,
                        read: false
                    })
                ]);

                if (!product || !otherUser || !product.user) {
                    return null;
                }

                const sellerId = product.user.toString();
                const currentUserIsSeller =
                    sellerId === currentUserId.toString();

                return {
                    _id: lastMessage._id,
                    product: {
                        _id: product._id,
                        title: product.title,
                        image: product.image
                    },
                    seller: sellerId,
                    buyer: currentUserIsSeller
                        ? otherUser._id.toString()
                        : currentUserId.toString(),
                    otherUser: {
                        _id: otherUser._id,
                        name: otherUser.name,
                        profilePicture: otherUser.profilePicture
                    },
                    lastMessage: {
                        text: lastMessage.text,
                        createdAt: lastMessage.createdAt
                    },
                    unreadCount
                };
            })
        );

        return res.status(200).json(inbox.filter(Boolean));
    } catch (err) {
        console.error("getInbox error:", err);

        return res.status(500).json({
            message: "Failed to load inbox"
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Message.countDocuments({
            receiver: req.userId,
            read: false
        });

        return res.status(200).json({ unreadCount });
    } catch (err) {
        console.error("getUnreadCount error:", err);

        return res.status(500).json({
            message: "Failed to count unread messages"
        });
    }
};

module.exports = {
    sendMessage,
    getConversation,
    getUnreadCount,
    getInbox
};