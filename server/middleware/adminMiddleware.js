
const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("role");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            message: "Could not verify admin access"
        });
    }
};

module.exports = adminMiddleware;
