const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mdp: { type: String, required: true },
    role: { type: String, enum: ["admin", "agent", "simpleUser"], required: true }
});

module.exports = mongoose.model("User", userSchema);
