//const express = require('express');
const express = require('express'),
app = express(),
 server = require('http').createServer(app);  

// var http = require("http").Server(app);
var io = require("socket.io")(server);
var socket = require('socket.io-client')('http://localhost');
 //var http = require("http").Server(app);

//const io = require('socket.io').listen(server);
 //const io = require('socket.io')(server);
 /*var express = require('express');

// App setup
var app = express();
var socket = require('socket.io')*/

const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const  expressValidator= require('express-validator');

const config = require('./config/databse');
const socketio = require('./socketio')(io);
//connect database
mongoose.connect(config.database,  {useNewUrlParser:true});

//connect database
mongoose.connect(config.database, {useNewUrlParser:true});
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
//on connection
mongoose.connection.on('connected',() =>{
    console.log('connected to database' + config.database);
    mongoose.set('useCreateIndex', true);

});

//on error
mongoose.connection.on('error', (err) =>{
    console.log('database error:' + err)
});


/*io.on('connection',function(socket){
  socket.on('comment',function(data){
      console.log("connected");
     // var commentData = new Comments(data);
      //commentData.save();
      socket.broadcast.emit('comment',data);  
  });

});*/


//var urlencodedParser = bodyParser.urlencoded({ extended: true });


//const app = express();
const port = process.env.PORT || 3000;//
//const port= 3000;




//set template engine
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

 
  
//define static path to use css files etc
app.use(logger('dev'));
//body parser and cookie parser middleware
app.use(bodyParser.urlencoded({extended: false}));
//parse application json
app.use(bodyParser.json());
//app.use(express.bodyParser({uploadDir:'./uploads'}));

//app.use(cookieParser('secret'));

//define static folders u will use
app.use(express.static(path.join(__dirname, 'node_modules')));
//app.use(express.static(path.join(__dirname +'/node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '/public')));

//use express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
   // cookie: { secure: true }
  }));

  //express messages middle ware
  app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator
 //express validator middleware
 //app.use(expressValidator());
 app.use(expressValidator({
    errorFormatter: function (param, msg, value){
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

      while(namespace.length){
        formParam  += '['+ namespace.shift() + ']';
      }
      return{
        param: formParam,
        msg: msg,
        value: value
      };
    }
  }));



//call all the routes
let  routes= require('./routes/index');
let programme = require('./routes/programme');
//let createProg = require('./routes/createProg');
let blogPosts = require('./routes/blogPosts');


//let imgupload = require('./routes/upload');
app.use('/', routes);
app.use('/programme', programme);
app.use('/blogPosts', blogPosts);
//app.use('/createProg', createProg);




/*io.on('connection',function(socket){
  socket.on('comment',function(data){
      console.log("connected");
     // var commentData = new Comments(data);
      //commentData.save();
      socket.broadcast.emit('comment',data);  
  });

});*/

/*io.on("connection", (socket) => {  
  console.log("A user has connected to the socket!");
  socket.on('disconnect', () => console.log('A user has disconnected from the socket!'));
});*/

  
server.listen(port, ()=>{
    console.log('server started on port'+port);
});

/*var server = app.listen(3000, function(){
  console.log('listening for requests on port 3000,');
});

let io = socket(server);*/
/*io.on('connection', function(socket){
console.log(`${socket.id} is connected`);
});*/


//io.on('connection',function(socket){
  //console.log("connected");

/*socket.on('comment',function(data){
    console.log("connected");
   // var commentData = new Comments(data);
    //commentData.save();
    socket.broadcast.emit('comment',data);  
});*/

//});