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
					var err;
					err['error'] = "Pas de correspondance.";
					res.end(JSON.stringify(err));
		    } else {
			    console.log('The solution is: ', rows);
			    res.end(JSON.stringify(rows[0]));
		    }
		  } else {
			  console.log('Error while performing Query.');
				var err;
				err['error'] = "Error while performing Query.";
				res.end(JSON.stringify(err));
		  }
	    });  
    });
	  
  } else {
		var err;
		err['error'] = "La requete doit être une requète POST";
    res.end(JSON.stringify(err));
  }
});




serveur.listen(3000);
