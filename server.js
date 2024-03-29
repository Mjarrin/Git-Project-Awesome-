
require('dotenv').config();
const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const authRoutes = require("./app/routes/auth-routes");
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const db = require("./config/keys").mongoURI;
const app = express();
const projectRoutes = require('./app/routes/project');
const userRoutes = require('./app/routes/users');
const collaboratorsRoutes = require('./app/routes/collaborator');
const mongoose = require("mongoose");

require('dotenv').config()

// global promises
mongoose.Promise = global.Promise;



// Setup express server
const PORT = process.env.PORT || 3001;

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'))
// }

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// allows other servers to maker requests coming from other localhost users
// We prevent CORS Errors  Cross Origin Resource Sharing (security mecanism from the browser)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

// Defines what kind of headers we accept from other Users
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  // Incoming request method (property which gives access to the HTTP method being used) on the request
  //  The Browser sends an Options request before to tell the browser what it should send before hand
  if (req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET ');
    res.status(200).json({});
  }  

  next();
});


//routes


app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/collaborators",collaboratorsRoutes);
app.use('/api/auth', authRoutes);






app.use(cookieSession({
  maxAge: 24 * 60 * 60 *1000,
  keys:[keys.session.cookieKey]
}));

//initialize passport

app.use(passport.initialize());
app.use(passport.session());



//auth routes




// Send every other request to the React app
// Define any API routes before this runs
// yarn build connects the back end with the front end

// process.env.MONGODB_URI ||
mongoose.connect( process.env.MONGODB_URI || process.env.DB_HOST, {  useNewUrlParser : true
},function (err,res){


  if (res){
    console.log("connected to MongoDb!")
  } else {
    console.log(err);
  }
});



// // Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build")); // tell the server where our react compiled build folder of our app is
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
  

}
app.listen(PORT, function () {
  

  console.log("App running on port " + PORT + "!");
});

module.exports = app // for testing

