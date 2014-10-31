(function() {
  var app, basicAuth, express;

  express = require('express');
  basicAuth = require('basic-auth-connect');

  app = express();

  app.set('port', process.env.PORT || 4000);

  app.use(basicAuth('sfdc', 't1'));

  app.use(express["static"]("./www"));
  var port = app.get('port');
  app.listen(port);
  module.exports = app;

  console.log('listening on ' + port);

}).call(this);