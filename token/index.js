const path = require('path');
const http = require('http');

const express = require('express');

const morgan = require('morgan');

const bodyParser = require("body-parser");

const exphbs = require('express-handlebars');

const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');


const app = express();

const PORT = 3000;

app.use(morgan('dev'));
app.use(cookieParser());

const SECRET_STRING = "Some random long string";

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));

app.use(express.static(path.resolve(__dirname, 'public')));

app.engine('.hbs', exphbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('views', path.join(__dirname + '', 'views'));
app.set('view engine', '.hbs');


app.get('/', (req, res) => {
    res.status(200);
    res.render("index");
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/dashboard', isUserLoggedIn, (req, res) => {
    res.render('dashboard');
})

app.post('/login', (req, res) => {

    console.dir(req.body)
    const username = req.body.username || '';
    const password = req.body.password || '';

    if (username === '' || password === '') {
        res.render("login", { message: "User name and password required to login" });
        return;
    }

    if (username === 'james' && password === 'password') {
        console.log("Cookie set......");
        var token = jwt.sign({ id: username }, SECRET_STRING, { expiresIn: 86400 });// 24 * 60 * 60 secs or 24 hours

        res.cookie('token', token, { httpOnly: false });
        res.render("dashboard");
        return;
    } else {
        res.render("login", { message: "username or password incorrect" })
    }
})


app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
})

function isUserLoggedIn(req, res, next) {
    let token;
    if(!req.cookie){
        res.redirect('/login');
    }
    token = req.cookie.token;

    if (!token) {
        //res.status(403);
        //res.send({ message: "token not available!" });
        res.render("error", { message: "token not available!" });
        return;
    }

    jwt.verify(token, SECRET_STRING, (err, decoded) => {
        if (err) {
            //res.status(401);
            //res.send({ message: "Unauthorized access..." });
            res.render("error", { message: "Unauthorized access..." });
            return;
        }
        req.userId = decoded.id;
        next();
    });
}

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})