var express   =   require( 'express' );
var multer    =   require( 'multer' );
var path      =   require('path');
var upload    =   multer( { dest: 'uploads/' } );
var sizeOf    =   require( 'image-size' );
var exphbs    =   require( 'express-handlebars' );
require( 'string.prototype.startswith' );
var csv = require('csv-parser');
var fs = require('fs');
var XLSX = require('xlsx');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
console.log("assume changes");
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
  console.log(req.body.fileType);
  console.log(req.file.mimetype);
  console.log(req.file.path);
  
  var header = getHeader(req.body.fileType);
  console.log(header);
  var filedata;
  if ( req.file.mimetype.startsWith( 'text/csv' ) ) {
    //console.log("mimetype is csv");
    parseCSV(req.file.path, function(array){
      //console.log("inside the callback");
      filedata = array;
      //console.log("filedata");
      //console.log(filedata);
      if(filedata && validateData(filedata[0], header)){
        console.log("200");
        return res.status( 200 ).send( req.file );
      } else {
        console.log("422");
        return res.status( 422 ).json( {
          error : 'MisMatched upload'
        } );
      }
    });
  }else if( req.file.mimetype.startsWith('application/vnd.ms-excel') || req.file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ) {
    

    //console.log("mimetype is xlsx");
    filedata = parseXL(req.file.path);
    //console.log("filedata");
      //console.log(filedata);
    if(filedata && validateData(filedata[0], header)) {
      console.log("200");
      return res.status( 200 ).send( req.file );
    } else {
      console.log("422");
      return res.status( 422 ).json( {
        error : 'MisMatched upload'
      } );
    }
  }
  //return res.status( 200 ).send( req.file );
});

function parseXL(file){
  console.log("parsingXL");
 var wb = XLSX.readFile(file);
 var sheet;
 if(wb.SheetNames.length == 5 ){
  sheet = wb.SheetNames[4];
 } else {
  sheet = wb.SheetNames[0];
 }
 var worksheet = wb.Sheets[sheet];
 var parsedArray = XLSX.utils.sheet_to_json(worksheet, {raw: true});
 return parsedArray;
}


function parseCSV(file, callback){
  var parsedArray = new Array();
  fs.createReadStream(file)
  .pipe(csv())
  .on('data', function(data) {
    parsedArray.push(data);
  })
  .on('end', function(){
    return callback(parsedArray);
  })

  setTimeout(function(){
    return parsedArray;
  }, 4000)
}

function validateData(data, headerList){
  console.log(headerList);
  var i = 0;
  console.log("data");
  //console.log(data);
  for (var prop in data){
    if(data.hasOwnProperty(prop)){
      //console.log(prop);
      
      if(prop == headerList[i]){
         i++;
         //console.log(prop);
      } else {
        return false;
      }
    }
  }
  return true;
}

function getHeader(partner){
  switch (partner){
    case 'eHealth': 
      return ehealthHeaders;
    case 'Agile':
      return agileHeaders;
    case 'GoHealth':
      return gohealthHeaders;
    case 'HealthMarkets':
      return hmHeaders;
    case 'Invoca':
      return invocaHeaders;
    case 'Katch':
      return katchHeaders;
    case 'Kelsey':
      return kelseyHeaders;
    case 'MediaAlpha':
      return mediaalphaHeaders;
    case 'Oscar':
      return oscarHeaders;
  }
}

//check xsl

var ehealthHeaders = ["APPLICATION ID",
"PRODUCTLINE TYPE",
"PARENT_PARTNER ID",
"ALLIANCE ID",
"CHANNEL",
"SUB CATEGORY",
"CATEGORY",
"STATE",
"ALLIANCE PARTNER_ID",
"SUBMIT DATE &amp; TIME",
"SUBMIT HOUR",
"SUBMIT COUNT",
"LATEST STATUS"];

var kelseyHeaders = 
["Date Submitted",
"Affiliate Name",
"Provider Name",
"Plan Name",
"Applicant First Name",
"Applicant Last Name",
"Applicant State",
"Applicant Zipcode",
"Persons Covered",
"Marketing Fee"];

var katchHeaders = 
["Day",
"Publisher Placement",
"PublisherCampaignName",
"Publisher Domain",
"PublisherDomainName",
"Queries",
"Clicks",
"Query Click Rate",
"Click eRPM",
"Rev Per Click",
"Pub Click Rev"]

var invocaHeaders = [
"Call Start Time",
"Transaction ID",
"Advertiser",
"Advertiser Campaign",
"Publisher ID",
"Publisher",
"Source",
"Promo Number Description",
"Call Result",
"Paid",
"Payout Conditions",
"Payin Conditions",
"City",
"Region",
"Repeat Caller",
"Caller ID",
"Phone Type",
"Total Duration (HH:MM:SS)",
"Connected Duration (HH:MM:SS)",
"Pool Param 1 Name",
"Pool Param 1 Value",
"Pool Param 2 Name",
"Pool Param 2 Value",
"Pool Param 3 Name",
"Pool Param 3 Value",
"Pool Param 4 Name",
"Pool Param 4 Value",
"Search Type",
"Pool Type",
"Recording",
"Corrected At",
"Call Record ID",
"Destination Phone Number"];

var oscarHeaders = [
"lead_date",
"current_status",
"zip_code",
"state",
"first_name",
"last_name",
"email",
"phone",
"utm_campaign"];

var mediaalphaHeaders = [
"Date",
"Sub 1",
"Sub 2",
"Sub 3",
"Form",
"Searches",
"Form CVR",
"Imprs",
"IPS",
"Clicks",
"CPS",
"RPC",
"Clk Rev",
"Calls",
"Transfers",
"TR",
"Q Calls",
"QR",
"RPQC",
"RPT",
"Call QR",
"RPCall",
"Call Rev",
"Leads",
"RPL",
"Lead Rev",
"Revenue",
"RPS"];

var agileHeaders = [
"Action Date",
"Action Id",
"Sub Id 1",
"Campaign",
"Action Tracker",
"Status",
"Action Earnings"]

var gohealthHeaders = [
"Date",
"Referral ID",
"Affiliate ID",
"Affiliate Name",
"Link ID",
"Link Name",
"State",
"Viewed Quotes",
"Account Created",
"Unsubmitted Application"];

var hmHeaders = [
"Rec_Type",
"State",
"Year",
"Month",
"Week",
"Date",
"Drop_Date",
"Vendor",
"Contact_ID",
"Line_of_Business",
"Media_Channel_Campaign",
"Media_Type",
"Invoca_Transaction_ID",
"Invoca_Source",
"Quote_Lead_ID",
"Quote_MarketingInitiative",
"Quote_RingPool_ID",
"Call_ID",
"Vendor_Call",
"Line_of_Business_Call",
"Invoca_Campaign_Call",
"Invoca_Transaction_ID_Call",
"Invoca_Source_Call",
"Quote_Lead_ID_Call",
"Quote_MarketingInitiative_Call",
"Quote_RingPool_ID_Call",
"Conv_Appt",
"Conv_Appt_Phone",
"Conv_Enroll",
"Conv_Enroll_Pseudo",
"Conv_Enroll_Online",
"Conv_Transfer_Agent",
"Conv_Quote_Phone",
"Conv_Quote_Online",
"Call",
"Lead",
"Payout",
"Payout_CPA",
"Payout_Non_CPA",
"Record",
"Effective_Sales"];

//check csv

app.listen( 8080, function() {
  console.log( 'Express server listening on port 8080' );
});