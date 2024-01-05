'use strict';

const dotenv  = require('dotenv').config({ path: require('find-config')('.env') })

const passport = require('passport');
const local    = require('passport-local').Strategy;
const google   = require('passport-google-oauth2').Strategy;
const session  = require('express-session');
const store    = require('express-mysql-session')(session)
const flash    = require('express-flash');
const lib      = require('.');

let db_host     = process.env.DB_HOSTNAME;
let db_user     = process.env.DB_USERNAME;
let db_password = process.env.DB_PASSWORD;
let db_database = process.env.DB_DATABASE;

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  },
  setup: function (app) {
    app.use(
      session({ secret: 'short', resave: false, saveUninitialized: false, cookie:{ secure: false },
        store: new store ({ host:db_host, user:db_user, password:db_password, database:db_database }),
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());    
    app.use(flash());

    passport.use (new local (function (username, passwd, done) {
      var admin = lib.mysql.searchAdminUserByEmail([username]);
      if (admin == null) {
        var member = lib.mysql.searchMemberByRcn([username]);
        if (member == null) { console.log('login-failure', username, passwd); return done(false, null); }
        if (member.passwd != passwd) { console.log('login-failure', username, passwd); return done(false, null); }
        console.log('login-success', member); 
        return done (null, member);
      }
      if(passwd === admin.passwd) { console.log('login-success', username, passwd, admin.username); return done (null, admin) }
      else { console.log('login-failure', username, passwd); return done(false, null); }
    }));

    passport.use(new google({
      clientID:     process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () { return done(null, profile); });
      }
    ));

    passport.serializeUser (function(user, done) {
      //console.log('serializeUser', user);
      done (null, user);
    });
  
    passport.deserializeUser (function(obj, done) {
      //console.log('deserializeUser', obj);
      done (null, obj);
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //app.post ('/auth/local', passport.authenticate ('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true, }));
    app.post ('/auth/local', function(req, res, next) {
      if(req.body.member == "1") passport.authenticate ('local', { successRedirect: '/admin',  failureRedirect: '/login', failureFlash: true, }) (req,res,next);
      else                       passport.authenticate ('local', { successRedirect: '/member', failureRedirect: '/login', failureFlash: true, }) (req,res,next);
    });
    app.get('/logout', function(req, res) { delete req.session.passport; delete req.session.group; res.redirect('/login'); });  
    app.get("/login", function (req, res) { res.render('login'); });
    app.get('/auth/google',   passport.authenticate('google', {scope: ['openid', 'email', 'profile']}), function(req, res){});
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) { console.log(req.query); res.redirect('/'); }); 

  },
}
