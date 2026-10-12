require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messageRoutes = require("./routes//messageRoutes");

const app = express();

app.use(express.json());
app.use(cors());



app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.json({
        message: "marketplace api is running"
    });
});

app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

app.listen(3000, () => {
    console.log("server is running on port 3000");
});