const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const passport = require('passport');
const expressJwt = require('express-jwt');
require('dotenv').config();
const secret = process.env.JWT_SECRET;
exports.authenticate = expressJwt({secret : secret});


const api = require('./server/routes/api');
const api2 = require('./server/routes/v2/api');

//parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(expressJwt({ secret: secret,   credentialsRequired: false}));
app.use(function (err, req, res, next) {
	let errRes = {};
	if (err.code === 'invalid_token') {
		errRes.type = "jwterror"
		errRes.message = "Authorisation error, please login again.";
		return res.status(401).json(errRes);
	} else {
		errRes.type = "nojwt"
		errRes.message = "You are not logged in.";
		return res.status(401).json(errRes);
	}
  });

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', api);
app.use('/api/v2', api2);


app.get('*', (req,res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
