require('dotenv').config()
require("./models/user");
require("./models/ticket");
const express = require('express')
const app=express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const ticketRoutes = require("./routes/routeTicket");
const UserRoutes = require("./routes/routeUser");
const AuthRoutes= require("./routes/routeAuth")
const NotifRoutes=require("./routes/routeNotif")
const cors = require('cors');
app.use(cors());
require("./models/user");
require("./models/ticket");
require("./models/notification")

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('Connected to DataBase')).catch(err=>console.log(err))

app.use(express.json());
app.use(cors());
app.use("/tickets", ticketRoutes);
app.listen(PORT, () => {
    console.log('Server running on http://localhost:4000');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/template/auth/login.html')})

app.use(express.static('template'));

app.get('/index',(req,res)=>{
    res.sendFile(__dirname+'/template/index.html')})

app.get('/login',(req,res)=>{
        res.sendFile(__dirname+'/template/auth/login.html')})

app.get('/register',(req,res)=>{
        res.sendFile(__dirname+'/template/auth/register.html')})

app.get('/agentList/:agentId',(req,res)=>{
    res.sendFile(__dirname+'/template/agent/ticketList.html')})

app.get('/adminTickets',(req,res)=>{
    res.sendFile(__dirname+'/template/admin/adminTicketAll.html')})

app.get('/adminTicketsNonAtt',(req,res)=>{
    res.sendFile(__dirname+'/template/admin/adminTicketNonAtt.html')})

app.get('/create',(req,res)=>{
    res.sendFile(__dirname+'/template/simpleUser/creation-ticket.html')})

app.get('/listTicketUser',(req,res)=>{
    res.sendFile(__dirname+'/template/simpleUser/liste-ticket-user.html')})

app.use("/tickets", ticketRoutes);
app.use('/users', UserRoutes);
app.use('/auth', AuthRoutes);
app.use('/notif', NotifRoutes);
