const express = require("express");
const Ticket = require("../models/ticket");
const User = require("../models/user");
const { envoyerNotification } = require("../services/notificationService")
const { authenticateUser, authorizeAdmin,authorizeUser } = require("../middleware/authMiddleware");
const router = express.Router();

// le nombre de tickets par état
router.get("/status", async (req, res) => {
  try {
      const statuses = ["A traiter", "En attente", "En cours", "Résolu"];
      const ticketStats = {};

      // Utiliser `Promise.all` pour exécuter les requêtes en parallèle
      await Promise.all(statuses.map(async (status) => {
          ticketStats[status] = await Ticket.countDocuments({ status });
      }));

      // Reformater les données pour correspondre au front-end
      const formattedData = statuses.map(status => ({
          _id: status,
          count: ticketStats[status] || 0
      }));

      res.json(formattedData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

//  le nombre de tickets("A traiter")
router.get("/ticketsAtraiter", async (req, res) => {
  try {
    const ticketsEnAttente = await Ticket.countDocuments({status:"A traiter"});
    res.json({ticketsEnAttente });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
});
// le nombre de tickets en cours de traitement
router.get("/tickets-en-cours", async (req, res) => {
  try {
    const ticketsEnCours = await Ticket.countDocuments({ status: "En cours" });

    res.json({ ticketsEnCours });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
});
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
router.get("/:agentId", async (req, res) => {
    try {
      const agentId = req.params.agentId;
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
router.put("/:ticketId", async (req, res) => {
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
                await envoyerNotification(admin._id, ticket._id, `📌 Un nouveau ticket a été créé : <strong>${ticket.title}</strong> dans la catégorie <strong>${ticket.category}</strong>.<br/> Veuillez l examiner et l affecter à un agent.`);
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
// le nombre de tickets par état
router.get("/status", async (req, res) => {
  try {
      const statuses = ["A traiter", "En attente", "En cours", "Résolu"];
      const ticketStats = {};

      // Utiliser `Promise.all` pour exécuter les requêtes en parallèle
      await Promise.all(statuses.map(async (status) => {
          ticketStats[status] = await Ticket.countDocuments({ status });
      }));

      // Reformater les données pour correspondre au front-end
      const formattedData = statuses.map(status => ({
          _id: status,
          count: ticketStats[status] || 0
      }));

      res.json(formattedData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
module.exports = router;
