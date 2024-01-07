'use strict';

let lib     = require('../lib');
let router  = require('.');
let moment  = require('moment-timezone');
let fs      = require('fs');

module.exports = function (app) {
  let dotenv = require('dotenv').config({ path: require('find-config')('.env') })
  let lib     = require('../lib');
  let verbose = true;

  lib.mysql.connect(process.env.DB_HOSTNAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_DATABASE, verbose);
  lib.passport.setup(app);
  

  
  //lib.receipts (app);
  //lib.upload (app);
  //router.json (app);
  //router.openapi (app);

  /*
  app.use(function(req, res, next) {
      var err = new Error('Not Found');
        err.status = 404;
          next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    //set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  */
  
  /*
  app.get('/', lib.passport.ensureAuthenticated, function (req, res, next) {
    if(req.session.passport.user.grade == undefined) {
      return res.redirect('/logout');
    }
    else {
      req.session.group = lib.mysql.searchAdminGroupByName([req.session.passport.user.grade]);
      res.render('admin', {user: req.session.passport.user, group: req.session.group, page: router.page.getPage('/admin')});
    }
  }); 
 */
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  app.get('/', function (req, res, next) {
    console.log ('req.session.passport', req.session.passport)
    res.render ('home', {passport: req.session.passport, 'page': 'home'})
  });


  app.get('/home', function (req, res, next) {
    console.log ('req.session.passport', req.session.passport)
    res.render ('home', {passport: req.session.passport, 'page': 'home'})
  });

  app.get('/signup', function (req, res, next) {
    res.render ('signup')
  });

  app.get('/404', function (req, res, next) {
    res.render ('404')
  });

  app.get('/500', function (req, res, next) {
    res.render ('500')
  });

  app.get('/blank', function (req, res, next) {
    res.render ('blank')
  });

  app.get('/contacts', function (req, res, next) {
    res.render ('contacts')
  });

  app.get('/language-menu', function (req, res, next) {
    res.render ('language-menu')
  });

  app.get('/lockscreen', function (req, res, next) {
    res.render ('lockscreen')
  });

  app.get('/profile', function (req, res, next) {
    res.render ('profile')
  });


  app.get('/forgot-password', function (req, res, next) {
    res.render ('forgot-password', {passport: req.session.passport, 'page': 'forgot-password'})
  });

  app.post ('/register', function (req, res, next) {
    console.log ("req.body", req.body)
    let user     = req.body.user
    let username = req.body.username
    let password = req.body.password
    console.log (id, password, username)
    res.render ('signup')
  });

  app.get('/admin', lib.passport.ensureAuthenticated, function (req, res, next) {
    console.log (req.session.passport)
    res.render ('admin', {passport: req.session.passport, 'page': 'home'})
  });

  app.get('/intro', lib.passport.ensureAuthenticated, function (req, res, next) {
    console.log (req.session.passport.user)
    res.render ('intro', {passport: req.session.passport.user})
  });


  app.get('/intro2', lib.passport.ensureAuthenticated, function (req, res, next) {
    res.render ('intro2', {passport: req.session.passport.user})
  });


  app.get('/member', lib.passport.ensureAuthenticated, function (req, res, next) {
    //console.log ('req.session.member',req.session.member);
    //var member = lib.mysql.findAdminMemberId ([req.session.member]);
    //res.render('member', {member: member, user: req.session.passport.user, page: router.page.getPage('/member')});
    res.send ('Hello')
  });
  
  app.get("/dashboard", function(req, res, next) {
    res.render("dashboard");
  });
  app.get("/receipts", function(req, res, next) {
    res.render("receipts");
  });
  app.get("/about", function(req, res, next) {
    res.render("about");
  });
  return app;
};
 

