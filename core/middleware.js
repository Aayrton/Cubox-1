exports.setup = function setup(app, conf, passport){
    var mysql   = require('mysql')
      , express = require('express')
      ,path = require('path')
      , methodOverride= require('method-override')
      , session = require('express-session')
      , flash    = require('connect-flash')
      , favicon = require('static-favicon')
      , logger = require('morgan')
      , cookieParser = require('cookie-parser')
      , bodyParser = require('body-parser')
      , pool    = mysql.createPool({
            host     : conf.db.mysql.host,
            user     : conf.db.mysql.user,
            port     : conf.db.mysql.port,
            password : conf.db.mysql.password,
            database : conf.db.mysql.database
        });

    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    require('./passport')(passport, pool);
    app.use(favicon());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(session({ secret: 'A65GIhJBtOv0dTIqMw0c' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(express.static(__dirname + '../public'));
    app.use(express.static(path.join(__dirname, '../public/')));

    /// error handlers

// development error handler
// will print stacktrace
    if (process.env.NODE_ENV === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
        app.use(function(req, res, next) {
            req.mysql   = pool;
            req.cache   = require('memoizee');
            req.store   = app.locals;
            next();
        });




};