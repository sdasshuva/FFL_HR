const fs = require('fs');
const async = require('async');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');

module.exports = function() {};

var fs = require('fs');
var async = require('async');
var mthCPNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var monthCapitalNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

var dayPower = ["",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
    "th", "th", "th", "th", "th", "th", "th", "th", "th", "th",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"
];
var factoryName = 'FASHION FLASH LIMITED (HO)';
var factoryShort = 'JCLFFL';

var ramadan2017 = [
    '2017-5-28', '2017-5-29', '2017-5-30', '2017-5-31',
    '2017-6-1', '2017-6-2', '2017-6-3', '2017-6-4',
    '2017-6-5', '2017-6-6', '2017-6-7', '2017-6-8',
    '2017-6-9', '2017-6-10', '2017-6-11', '2017-6-12',
    '2017-6-13', '2017-6-14', '2017-6-15', '2017-6-16',
    '2017-6-17', '2017-6-18', '2017-6-19', '2017-6-20',
    '2017-6-21', '2017-6-22', '2017-6-23', '2017-6-24',
    '2017-6-25', '2017-6-26', '2017-6-27', '2017-6-28'
];


Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

Date.prototype.formatDate = function() {
    var d = new Date(this)
    return addLeadingZero(2, d.getDate()) + '-' + mthCPNames[d.getMonth()] + '-' + d.getFullYear();
};

function addExtJsFront(callback) {
    walk('app', function(err, files) {
        if (err) throw err;
        var script = '\n';
        async.eachSeries(files, function(file, cb) {
            script = script + '<script type="text/javascript" src="' + file.replace("app", "/js") + '"></script>\n';
            cb();
        }, function(err) {
            if (err) {
                throw err;
            }
            callback({
                extjs_app_scripts: script
            })
        })
    })
}

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    })
                } else {
                    results.push(file)
                    next()
                }
            })
        })()
    })
}

function authRouter(app, dbFull, io) {
    var db = dbFull.MM_College

    var isAuthenticated = function(req, res, next) {
        //console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/signout');
    }

    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        db.user.findAll({
            where: {
                id: id
            },
            limit: 1
        }).complete(function(err, user) {
            done(err, user[0]);
        })
    });

    passport.use('signin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            db.user.findAll({
                where: {
                    email: email
                },
                limit: 1
            }).complete(function(err, user) {
                if (err)
                    return done(err);
                if (!user[0]) {
                    console.log('User Not Found with email ' + email);
                    return done(null, false,
                        req.flash('message', 'User Not found.'));
                }
                // User exists but wrong password, log the error 
                if (!isValidPassword(user[0], password)) {
                    console.log('Invalid Password');
                    return done(null, false,
                        req.flash('message', 'Invalid Password'));
                }
                // User and password both match, return user from 
                // done method which will be treated like success
                return done(null, user[0]);
            })
        }));

    /************************************************************************************************/
    /**************************** RIPS ROUTING STARTS ***********************/
    /*************************************************************************************************/

    app.get('/', isAuthenticated, function(req, res) {
        require('../config/controller/index_controller.js')(db, function(r) {
            res.render('index.ejs', {
                title: "HR & Payroll System",
                user: req.user,
                extjs_app_scripts: r.extjs_app_scripts
            });
        })
    });

    app.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/signin');
    });

    /* GET login page. */
    app.get('/signin', function(req, res) {
        req.logout();
        // Display the Login page with any flash message, if any
        res.render('signin.ejs', {
            message: req.flash('message')
        });
    });

    /* Handle Login POST */
    app.post('/signin', passport.authenticate('signin', {
        successRedirect: '/',
        failureRedirect: '/signout',
        failureFlash: true
    }));
}

module.exports.authRouter = authRouter;