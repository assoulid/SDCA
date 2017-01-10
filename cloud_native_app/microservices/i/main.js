var http        = require("http");
var mysql       = require('mysql');
var url         = require('url');
var qs          = require('querystring');
var request     = require('request');
var ip          ='';

/*request("http://localhost:8500/v1/catalog/sarvice/mysql", function( error, response, body){
  ip = response[1]["Address"];
});*/

var connection  = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'prestashop'
});


connection.connect(function(err){
	if(!err) {
		console.log("Database is connected ... nn");    
	} else {
	    	console.log("Error connecting database ... nn");    
	}
});

var serveur = http.createServer(function(req,res){
	if (req.method === 'POST'){
    var body = '';
    req.on('data', function(data){ body += data; });
    req.on('end', function(){ 
      var parsedbody = qs.parse(body); 
      var reqSQL = "SELECT * from ps_customer WHERE email='" + parsedbody['login'] + "' AND passwd='" + parsedbody['password'] +"'";
      console.log(reqSQL);
      connection.query(reqSQL, function(err, rows, fields) {
		  connection.end();
		  if (!err){
		    if (rows.length == 0){
		      console.log('Pas de correspondance: ' + parsedbody['login'] + "/" + parsedbody['password']);
			    res.end('Pas de correspondance.\n');
		    } else {
			    console.log('The solution is: ', rows);
			    res.end(JSON.stringify(rows));
		    }
		  } else {
			  console.log('Error while performing Query.');
			  res.end('Error while performing Query.\n');
		  }
	    });  
    });
	  
  } else {
    res.end('La requete doit être une requète POST\n');
  }
});

serveur.listen(3000);
