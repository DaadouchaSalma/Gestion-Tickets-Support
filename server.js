const express = require('express')
const app=express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
require('dotenv').config()

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
}
)