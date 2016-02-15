var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var csv = require('csv-parser');
var fs = require('fs');
var XLSX = require('xlsx');


var app = express();


/* DO SOMETHING WITH workbook HERE */

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//parseCSVReports();
this.parseXLSXReports();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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


module.exports = app;

















var parseCSVReports = function(){
// Invoca
var invoca = new Array();

fs.createReadStream('reports/invoca.csv')
  .pipe(csv())
  .on('data', function(data) {
    console.log('row', data);
    invoca.push(data);
  })
// End Invoca 


// Media Alpha
var mediaalpha = new Array();
//not absolutely coming in correctly need to tweak the header of the table
fs.createReadStream('reports/mediaalpha.csv')
  .pipe(csv())
  .on('data', function(data) {
    console.log('row', data);
    mediaalpha.push(data);
  })
// End Media Alpha

// Agile
var agile = new Array();

fs.createReadStream('reports/agile.csv')
  .pipe(csv())
  .on('data', function(data) {
    console.log('row', data);
    agile.push(data);
  })
// End Agile
}


var parseXLSXReports = function(){
  // E-Health
  var workbook = XLSX.readFile(path.join(__dirname, 'ehealth.xls'));
  console.log(workbook);

  //
}