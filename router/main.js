'use strict';

let lib     = require('../lib');
let router  = require('.');
let moment  = require('moment-timezone');
let fs      = require('fs');

module.exports = function (app) {
  let dotenv  = require('dotenv').config({ path: require('find-config')('.env') })
  let verbose = true;

  lib.mysql.connect (process.env.DB_HOSTNAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_DATABASE, verbose);
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
  app.get('/', lib.passport.ensureAuthenticated, function (req, res, next) {
    if(req.session.passport.user.grade == undefined) {
      return res.redirect('/logout');
    }
    else {
      req.session.group = lib.mysql.searchAdminGroupByName([req.session.passport.user.grade]);
      res.render('admin', {user: req.session.passport.user, group: req.session.group, page: router.page.getPage('/admin')});
    }
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
 

