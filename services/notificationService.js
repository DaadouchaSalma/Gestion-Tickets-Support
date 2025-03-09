const Notification = require("../models/notification");

// 🔔 Fonction pour envoyer une notification
const envoyerNotification = async (userId, ticketId, message) => {
    try {
        const notification = new Notification({
            user: userId,
            ticket: ticketId,
            message: message
        });
        await notification.save();
        console.log(`🔔 Notification envoyée à l'utilisateur ${userId} : ${message}`);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de la notification :", error);
    }
};

module.exports = { envoyerNotification };
