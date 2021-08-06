const express = require("express");
const http = require('http');
const morgan = require('morgan');
const app = express();

const auth = require('./auth');


const PORT = 3000;


app.use(morgan('dev'));


app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome the express App");
})


//app.use(auth);
app.get('/secret', auth, (req, res)=>{
    res.status(200);
    res.send('Top secret...');
})


app.get('/logout', (req, res)=>{
    res.removeHeader('WWW-Authenticate')
})

const server = http.createServer(app);




server.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})