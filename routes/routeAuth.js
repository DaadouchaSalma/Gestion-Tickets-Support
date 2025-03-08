const express = require('express')
const router = express.Router()
const User = require("../models/user")
const jwt = require('jsonwebtoken')

router.post('/register',async(req, res) => {
    try{
        const {nom, prenom, email, password} = req.body;
        const user = new User({nom, prenom, email, password})
        await user.save()
        res.status(201).send({message: "user saved successfully", user})
    } catch(error) {
        res.status(500).send({message:error.message});   
    }
})

router.post('/login',async(req,res)=>{      
    try{
        const{email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            res.status(404).send({message:"user not found "})
        }
      
        const isHavePassword=await  user.comparePassword(password)
        
        if(!isHavePassword){
            res.status(400).send({ message: "invalid credentiels"})
        }
        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY)
        res.send({message:"user logged in successfully",token})
    } catch(error){
        res.status(400).send({message:error.message})
    }
})
module.exports = router