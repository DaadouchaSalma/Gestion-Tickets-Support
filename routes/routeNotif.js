const express = require("express");
const Notification = require("../models/notification");
const { authenticateUser,authorizeAdmin } = require("../middleware/authMiddleware");
const { route } = require("./routeUser");

const router = express.Router();

//Récupérer les notifications non lues de l'admin
router.get("/unread", authenticateUser,authorizeAdmin, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id, read: false }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications" });
    }
});
router.put("/markAsRead", authenticateUser,authorizeAdmin, async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
        res.json({ message: "Toutes les notifications ont été marquées comme lues." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour des notifications" });
    }
});
router.get("/nbNotif", async (req, res) => {
    try {

      const unreadCount = await Notification.countDocuments({  read: false });
      res.json({ unreadCount });
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
