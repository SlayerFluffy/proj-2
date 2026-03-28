const express = require('express');
const mongodb = require('./data/database');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    next();
});
app.use('/', require('./routes'));



mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Running on port ${port}`)});
    }
});