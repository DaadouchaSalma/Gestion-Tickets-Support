const express = require('express')
const app=express()
require('dotenv').config()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const ticketRoutes = require("./routes/routeTicket");
const UserRoutes = require("./routes/routeUser");
require("./models/user");
require("./models/ticket");


mongoose.connect(process.env.MONGO_URI).then(()=>console.log('Connected to DataBase')).catch(err=>console.log(err))

app.use(express.json());
app.listen(PORT, () => {
    console.log('Server running on http://localhost:4000');
});
app.get('/', (req, res) => {
    res.send('Hello from server!');
});
app.use(express.static('template'));
app.get('/index',(req,res)=>{
    res.sendFile(__dirname+'/template/index.html')
})
app.get('/adminTickets',(req,res)=>{
    res.sendFile(__dirname+'/template/admin/adminTicketAll.html')
})
app.get('/adminTicketsNonAtt',(req,res)=>{
    res.sendFile(__dirname+'/template/admin/adminTicketNonAtt.html')
})
app.use("/tickets", ticketRoutes);
app.use('/users', UserRoutes);