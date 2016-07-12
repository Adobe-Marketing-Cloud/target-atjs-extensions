var http = require('http'),
	express = require('express'),
  	app = express(),
	path = require('path'),
	port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Create server
 */
http.createServer(app).listen(port);

/**
 * Setting up the static directory for serving files
 */
app.use(express.static(__dirname));
app.use('/at-js', express.static('../at-js'));

/**
 * Show a message Mango App is running
 */
console.log('Mango App running at http://localhost:' + port);

/**
 * Handle 404
 * Note: always keep it last
 */
app.use(function(req, res) {
  res.status(404).sendFile(path.join(__dirname + '/assets/404.html'));
});
