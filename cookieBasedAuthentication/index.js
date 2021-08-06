const path = require('path');
const http = require('http');

const express = require('express');
const session = require("express-session");
const MongoStore = require("connect-mongo");

const morgan = require('morgan');

const bodyParser = require("body-parser");

const exphbs = require('express-handlebars');


const app = express();

const PORT = 3000;

app.use(morgan('dev'));

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 6000 },
    store: new MongoStore({
        mongoUrl: 'mongodb://localhost:55556/?readPreference=primary&appname=MongoDB%20Compass&ssl=false',
        ttl: 24 * 60 * 60,
        dbName: 'test-app'
    })
}))

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

app.get('/dashboard', isUserLoggedIn,  (req, res) => {
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
        req.session.currentUser = username;
        res.redirect("/dashboard")
        return;
    } else {
        res.render("login", { message: "username or password incorrect" })
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    })
})

function isUserLoggedIn(req, res, next) {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login");
    }
}

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})