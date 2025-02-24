const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");

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

router.put("/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.ticketId, { status: req.body.status }, { new: true });
    console.log(ticket);
    res.json(ticket);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
