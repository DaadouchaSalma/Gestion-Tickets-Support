//Récupérer tous les tickets
const express = require("express");
const Ticket = require("../models/ticket");
const router = express.Router();
//Récupérer tous les tickets
router.get("/tousTickets", async (req, res) => {
    try {
        const tickets = await Ticket.find().populate("user", "email");
       
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des tickets." });
    }
});
// Récupérer les tickets "a traiter"
router.get("/Atraiter", async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: "A traiter" }).populate("user", "email");
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des tickets." });
    }
});
//Assigner un agent à un ticket
router.put("/assign/:id", async (req, res) => {
    try {
        const { agentId } = req.body; 
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { agent: agentId, status: "En attente" });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket non trouvé." });
        }

        res.status(200).json({ message: "Ticket assigné avec succès.", ticket });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'assignation du ticket." });
    }
});

module.exports = router;
