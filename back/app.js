var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètre
var urlencodedParser = bodyParser.urlencoded({ extended: false });


/***** DB Part ****/
const { Pool, Client } = require('pg')
const connectionString = 'postgres://{rds_url}' //postgres://rds_user:rds_password@rds_host:rds_port/rds_database
const pool = new Pool({  connectionString: connectionString,  })
/***** ***********/

var app = express();
app.use(session({secret: 'secret'}))

.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", req.get('origin'));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials","true");
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
})

//Sans backend
/*
function list(tab) {
	var json = new Object();
      json.name = "My API todo list"
      json.list = tab;
      return json
      }

.get('/todo/list2', function(req, res) { 
        res.writeHead(200, {'Content-Type': 'application/json'});
	res.write(JSON.stringify(list(req.session.todolist)))
	res.end();
})

.get('/todo/add2/:add/', function(req, res) {
	  req.session.todolist.push(req.params.add);
	  res.writeHead(200, {'Content-Type': 'text/html'});
	  res.write("ok");
	  res.end();
})

.get('/todo/rm2/:rm/', function(req, res) {

	        req.session.todolist.splice(req.params.rm, 1);
	        res.writeHead(200, {'Content-Type': 'text/html'});
	        res.write("ok");
	        res.end();
})
*/

// Avec backend

.get('/todo/add/:add/', function(req, res) {
  pool.query('INSERT INTO test (name) VALUES ($1) RETURNING *',[req.params.add],(err, result) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    //console.log(result)
    res.write("Value " + result.rows[0].name + " inserted in db !")
    res.end()
  })
})

.get('/todo/rm/:rm/', function(req, res) {
  	pool.query('DELETE FROM test WHERE ID=$1 RETURNING *',[req.params.rm],(err, result) => {
	res.writeHead(200, {'Content-Type': 'text/html'});
	//console.log(result)
	res.write("Value " + result.rows[0].name + " deleted from db ");
 	res.end();
	})
})

.get('/todo/list', function(req, res) {
	pool.query('SELECT * FROM test', (err, result) => {
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.write(JSON.stringify(result.rows))
		res.end()
	})
})


// default redirect
.use(function(req, res, next){
    res.redirect('/todo/list');
})

.listen(8080);   
