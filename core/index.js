exports.init = function init(){
    var router  = require('./router')
        , middleware  = require('./middleware')
        , express = require('express')
        , passport = require('passport')
        , app     = express()
        , conf    = require('./conf').get('personal'); // Use 'personal' instead of 'process.env.NODE_ENV.

    middleware.setup(app, conf, passport);
    router.run(function(){}, app, conf.application.routes, passport);

    app.listen(conf.server.port, function(){
        console.log('node-rest-demo pid %s listening on %d in %s',process.pid,conf.server.port,process.env.NODE_ENV);
    });

};