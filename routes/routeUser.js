const express=require("express");
const router=express.Router();
const User=require("../models/user");

//recuperer les agents 
router.get("/agents",async(req,res)=>{
    try{
        const agents=await User.find({role:"agent"},"nom prenom");
        res.json(agents);
    }catch(error){
        res.status(500).json({ error: "Erreur lors de la récupération des agents" });  
    }
});

module.exports = router;