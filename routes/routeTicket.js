const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");

router.post("/add", async (req, res) => {
    try {
      const ticket = new Ticket(req.body);
      await ticket.save();
      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
router.get('/', async (req, res) => {
    try {
      const tickets = await Ticket.find({});
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
module.exports = router;
