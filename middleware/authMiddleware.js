const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decoded.userId);

        if (!req.user) {
            return res.status(401).json({ message: "User not found." });
        }

        next();
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

const authorizeAgent = (req, res, next) => {
    if (req.user.role !== "agent") {
        return res.status(403).json({ message: "Access denied. Only agents can access this page." });
    }
    next();
};
const authorizeUser = (req, res, next) => {
    if (req.user.role !== "simpleUser") {
        return res.status(403).json({ message: "Access denied. Only users can access this page." });
    }
    next();
};
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Only admin can access this page." });
    }
    next();
};
module.exports={ authenticateUser, authorizeAdmin,authorizeAgent,authorizeUser }