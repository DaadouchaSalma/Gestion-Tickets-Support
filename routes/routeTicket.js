const express = require("express");
const Ticket = require("../models/ticket");
const User = require("../models/user");
const { envoyerNotification } = require("../services/notificationService")
const { authenticateUser, authorizeAdmin, authorizeAgent, authorizeUser } = require("../middleware/authMiddleware");
const router = express.Router();


//Récupérer tous les tickets
router.get("/tousTickets",authenticateUser, authorizeAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.find().populate("user", "email");
       
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des tickets." });
    }
});

// Récupérer les tickets "a traiter"
router.get("/Atraiter",authenticateUser, authorizeAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: "A traiter" }).populate("user", "email");
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des tickets." });
    }
});

//Assigner un agent à un ticket
router.put("/assign/:id",authenticateUser, authorizeAdmin, async (req, res) => {
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

//Liste des tickets d'un agent 
router.get("/liste", authenticateUser, authorizeAgent, async (req, res) => {
  try {
    const agentId = req.user._id;
    console.log(agentId);
    const tickets = await Ticket.find({ agent: agentId }).populate('user', 'email').exec();
    console.log(tickets);

    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found for this agent." });
    }
    res.json(tickets);

  } catch (error) {
    res.json({ message: error.message });
  }
});

//Update status tickets
router.put("/:ticketId",  authenticateUser, authorizeAgent, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.ticketId, { status: req.body.status }, { new: true });
    console.log(ticket);
    res.json(ticket);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//Create ticket
router.post("/add", authenticateUser, authorizeUser, async (req, res) => {
  try {
      const ticket = new Ticket({...req.body, user: req.user._id});
      await ticket.save();
      const admins = await User.find({ role: "admin" });
      console.log("les admins",admins);
        if (admins.length > 0) {
            for (let admin of admins) {
                await envoyerNotification(admin._id, ticket._id, "📌 Un nouveau ticket a été créé et doit être attribué à un agent.");
            }
        }
      res.status(201).json(ticket);
  } catch (error) {
      res.status(400).json({ message: "not found" });
  }
});

//List ticket user
router.get('/', async (req, res) => {
    try {
      const tickets = await Ticket.find({});
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;
