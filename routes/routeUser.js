const express=require("express");
const router=express.Router();
const User=require("../models/user");
const Ticket=require("../models/ticket");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");
//recuperer les agents 
router.get("/agents",async(req,res)=>{
    try{
        const agents=await User.find({role:"agent"},"nom prenom");
        res.json(agents);
    }catch(error){
        res.status(500).json({ error: "Erreur lors de la récupération des agents" });  
    }
});
//le nombre d'agents
router.get("/nb-agents", async (req, res) => {
    try {
      const nbAgents = await User.countDocuments({ role: "agent" });
      res.json({ nbAgents });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur du serveur");
    }
  });
  // le nombre d'users
router.get("/nb-users", async (req, res) => {
  try {
    const nbUsers = await User.countDocuments({ role: "simpleUser" });
    res.json({ nbUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
});
//le nombre de tickets par agent
router.get("/TotalTicketAgent", async (req, res) => {
  try {
    const ticketsResolusParAgent = await Ticket.aggregate([
      { $group: { _id: "$agent", count: { $sum: 1 } } }, 
    ]);
    res.json(ticketsResolusParAgent);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});
//le nombre de tickets Résolu par agent
router.get("/ResoluAgent", async (req, res) => {
  try {
    const ticketsResolusParAgent = await Ticket.aggregate([
      {$match:{status:"Résolu"}},
      { $group: { _id: "$agent", count: { $sum: 1 } } }, 
    ]);
    res.json(ticketsResolusParAgent);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});
router.get("/agentsTickets",authenticateUser, authorizeAdmin, async (req, res) => {
  try { const agents = await User.find({ role: "agent" });
    const stats = await Promise.all( agents.map(async (agent) => { 
    const totalTickets = await Ticket.countDocuments({ agent: agent._id }); 
    const resolvedTickets = await Ticket.countDocuments({ agent: agent._id, status: "Résolu" }); 
        return { nom: `${agent.nom} ${agent.prenom}`, totalTickets, resolvedTickets }; 
      }) 
    ); 
    res.json(stats); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  } }); 
  //ajouter Agent
  router.post('/ajoutAgent',authenticateUser, authorizeAdmin,async(req, res) => {
      try{
          const {nom, prenom, email, password,role} = req.body;
          const user = new User({nom, prenom, email, password,role})
          await user.save()
          res.status(201).send({message: "agent saved successfully", user})
      } catch(error) {
          res.status(500).send({message:error.message});   
      }
  })
  //recuperer tous les agents
router.get("/tousAgents", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
      const agents = await User.find({ role: "agent" });
      const agentsWithStats = await Promise.all(
          agents.map(async (agent) => {
              const totalTickets = await Ticket.countDocuments({ agent: agent._id });
              return {
                  ...agent.toObject(), 
                  totalTickets
              };
          })
      );
      res.status(200).json(agentsWithStats);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la récupération des agents." });
  }
});
module.exports = router;