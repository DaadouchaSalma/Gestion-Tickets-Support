const express = require('express')
const app=express()
require('dotenv').config()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const ticketRoutes = require("./routes/routeTicket");
const UserRoutes = require("./routes/routeUser");
const cors = require("cors");

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('Connected to DataBase')).catch(err=>console.log(err))

app.use(express.json());
app.use(cors());
app.use("/tickets", ticketRoutes);
app.listen(PORT, () => {
    console.log('Server running on http://localhost:4000');
});
app.get('/', (req, res) => {
    res.send('Hello from server!');
});
app.use(express.static('template'));
app.get('/index',(req,res)=>{
    res.sendFile(__dirname+'/template/index.html')
}
)
app.get('/create',(req,res)=>{
    res.sendFile(__dirname+'/template/simpleUser/creation-ticket.html')
}
)
app.get('/listTicketUser',(req,res)=>{
    res.sendFile(__dirname+'/template/simpleUser/liste-ticket-user.html')
}
)

/*
app.get('/create',(req,res)=>{
    res.sendFile(__dirname+'/template/creation-ticket.html')
}
)
app.get('/all',(req,res)=>{
    res.sendFile(__dirname+'/template/liste-ticket-user.html')
}
)*/
//app.use("/tickets", ticketRoutes);
