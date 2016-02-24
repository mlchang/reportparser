var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var multer   =  require( 'multer' );
var upload   =  multer( { dest: 'uploads/' } );
var exphbs   =  require( 'express-handlebars' );


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

app.set('view engine', 'ejs');





/*
* PARSE EXCEL FILES
*/

var ehealthWB = XLSX.readFile(path.join(__dirname, 'reports/ehealth.xls'));
var ehealthfirstsheet = ehealthWB.SheetNames[0];
var ehealthworksheet = ehealthWB.Sheets[ehealthfirstsheet];
var ehealthArray = XLSX.utils.sheet_to_json(ehealthworksheet, {raw: true});

var ehealthfirstsheet2 = ehealthWB.SheetNames[1];
var ehealthworksheet2 = ehealthWB.Sheets[ehealthfirstsheet2];
var ehealthArray2 = XLSX.utils.sheet_to_json(ehealthworksheet2, {raw: true});


var hmWB = XLSX.readFile(path.join(__dirname, 'reports/healthmarkets.xlsx'));
var hmfirstsheet = hmWB.SheetNames[4];
var hmworksheet = hmWB.Sheets[hmfirstsheet];
var hmArray = XLSX.utils.sheet_to_json(hmworksheet, {raw: true});


var kelseyWB = XLSX.readFile(path.join(__dirname, 'reports/kelsey.xlsx'));
var kelseyfirstsheet = kelseyWB.SheetNames[0];
var kelseyworksheet = kelseyWB.Sheets[kelseyfirstsheet];
var kelseyArray = XLSX.utils.sheet_to_json(kelseyworksheet, {raw: true});

var katchWB = XLSX.readFile(path.join(__dirname, 'reports/katch.xlsx'));
var katchfirstsheet = katchWB.SheetNames[0];
var katchworksheet = katchWB.Sheets[katchfirstsheet];
var katchArray = XLSX.utils.sheet_to_json(katchworksheet, {raw: true});

var gohealthWB = XLSX.readFile(path.join(__dirname, 'reports/gohealth.xlsx'));
var gohealthfirstsheet = gohealthWB.SheetNames[0];
var gohealthworksheet = gohealthWB.Sheets[gohealthfirstsheet];
var gohealthArray = XLSX.utils.sheet_to_json(gohealthworksheet, {raw: true});

//apps/ submitted apps/ paid per row
//leads/ number of people that have filled out a lead formt hat were transfered to health, possible money.
//grand total 

/**
* function to convert XLSX to JSON
*/
function XLSXtoJSON(){

}

/*
* PARSE CSV FILES
*/

// Oscar
var oscar = new Array();

fs.createReadStream('reports/oscar.csv')
  .pipe(csv())
  .on('data', function(data) {
    
    oscar.push(data);
  })
  .on('finish', function(){
    //console.log("finished oscar");
    //console.log(oscar[0]);
  })
// End Oscar

// Invoca
var invoca = new Array();

fs.createReadStream('reports/invoca.csv')
  .pipe(csv())
  .on('data', function(data) {
    
    invoca.push(data);
  })
  .on('finish', function(){
    //console.log("finished invoca");
    //console.log(invoca[0]);
  })
// End Invoca 

var stream = csv();
// Media Alpha
var mediaalpha = new Array();
//not absolutely coming in correctly need to tweak the header of the table
fs.createReadStream('reports/mediaalpha.csv')
  .pipe(csv())
  .on('data', function(data) {
    
    mediaalpha.push(data);
  })
  .on('finish', function(){
    
  })
// End Media Alpha


// Agile
var agile = new Array();
fs.createReadStream('reports/agile.csv')
  .pipe(csv())
  .on('data', function(data) {
    agile.push(data);
  })
  .on('finish', function(){
    //console.log("finished agile");
   //console.log(agile[0]);
  })

// End Agile
/*
console.log("ehealth:");
console.log(ehealthArray);

console.log("hm:");
console.log(hmArray[0]);

console.log("kelsey:");
console.log(kelseyArray);

console.log("katch:");
console.log(katchArray[0]);
console.log("gohealth:");
console.log(gohealthArray[0]);
*/
/*
  //defer all of these until the end of the processing(wait or callback for each);
  console.log("oscar:");
  console.log(oscar[0]);
  console.log("invoca:");
  console.log(invoca[0]);
  console.log("mediaalpha");
  console.log(mediaalpha[0]);
  console.log("agile");
  console.log(agile);
  console.log(agile[0]);
*/

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});


// error handlers

// development error handler
// will print stacktrace

app.get( '/', function( req, res, next ){
  return res.render( 'index' );
});

app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {

  if ( !req.file.mimetype.startsWith( 'image/' ) ) {
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } );
  }
  /**
  var dimensions = sizeOf( req.file.path );

  if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
    return res.status( 422 ).json( {
      error : 'The image must be at least 640 x 480px'
    } );
  }*/

  return res.status( 200 ).send( req.file );
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


module.exports = app;

















var parseCSVReports = function(){

}


var parseXLSXReports = function(){
  // E-Health
  

  //
}