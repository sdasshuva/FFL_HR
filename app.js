const express = require('express');
const cors = require('cors');
const http = require('http').Server(express);
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');
const multer = require('multer');

process.env.TZ = 'UTC'

const app = express()
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(cors())
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded())
app.use('/extjs', express.static('../extjs'))
app.use('/js', express.static(__dirname + '/app'))
app.use('/style', express.static(__dirname + '/public/style'))
app.use('/public', express.static(__dirname + '/public'))
app.use('/views', express.static(__dirname + '/views'))

app.use(multer({
    dest: __dirname + '/public/images/'
}).single('image'));

app.use(session({
    secret: 'ThisIsAVeryLongSecret', // session secret
    cookie: {
        maxAge: 18000000
    }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash()); // use connect-flash for flash messages stored in session

// /////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////

const db = {};
db.FFL_HR = require(__dirname + '/config/database/ffl_hr.js')
db.FFL_HR.connect()

// /////////////////////////////////////////////////////////////////////////////////

const server = app.listen((process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? 8000 : 8020)
const io = require('socket.io').listen(server)

// /////////////////////////////////////////////////////////////////////////////////

require(__dirname + '/config/authRouter.js').authRouter(app, db, io)
require(__dirname + '/config/mainRouter.js').mainRouter(app, db, io)

// /////////////////////////////////////////////////////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});