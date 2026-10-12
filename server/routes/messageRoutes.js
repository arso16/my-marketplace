
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    sendMessage,
    getConversation,
    getUnreadCount,
    getInbox
} = require("../controllers/messageController");

router.use(authMiddleware);

router.get("/unread-count", getUnreadCount);
router.get("/inbox", getInbox);
router.post("/", sendMessage);
router.get("/:productId/:sellerId", getConversation);

module.exports = router;