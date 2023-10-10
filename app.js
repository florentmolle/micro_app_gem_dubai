
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// const port = 3001;
const port = process.env.PORT || 3001;
const path = require('path');

const app = express();


// Trust proxy
// app.set('trust proxy', true);


// Add CSP
app.use(function(req, res, next) {
	res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com https://cdn.jsdelivr.net");
	return next();
});
    
const server = http.createServer(app);
const io = socketIo(server);

//SESSION
// const session = require('express-session');
const session = require('cookie-session');


//LIMITER
const rateLimit = require("express-rate-limit");

//ROUTES
const loginRoute = require('./routes/loginRoute');
const indexRoute = require('./routes/indexRoute');
const uploadCapturedDataRoute = require('./routes/uploadCapturedDataRoute')(io);
const checkAuthenticated = require('./middlewares/checkAuthenticated');
const downloadRoute = require('./routes/downloadRoute');


//Handle JSON
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//SESSION

// app.use(session({
// 	secret: "vf_gems_flo00",
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: { secure: 'auto' }
// }));
app.use(session({
	name: 'session',
	keys: ['vf_gems', 'flo_06'],
	// Cookie Options
	maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


//TEST CREATE MY PASWORD
// const bcrypt = require('bcryptjs');
// const saltRounds = 10;
// let plainPassword = 'vf_gems';
// bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
//   // Now you can store the hashed password in the database
//   console.log("hashedPassword : ", hashedPassword);
// });

//LIMITER
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100 // limit each IP to 100 requests per windowMs
});
// app.use(limiter);

//EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Public static file
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Login route (unprotected)
app.use('/',limiter, loginRoute);
app.use('/download', downloadRoute);


//ROUTES protected
app.use(checkAuthenticated);
app.use('/', indexRoute);
app.use('/', uploadCapturedDataRoute);


// Start the server
server.listen(port, '0.0.0.0', () => {
  	console.log(`App listening at http://'0.0.0.0':${port}`)
});
