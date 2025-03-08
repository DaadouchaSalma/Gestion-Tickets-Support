const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "agent", "simpleUser"], required: true, default: "simpleUser"}
});

userSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password,10)
    }
    next();
})

userSchema.methods.comparePassword = async function (userPassword) {
    return bcryptjs.compare(userPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);
