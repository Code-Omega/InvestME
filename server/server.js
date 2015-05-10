// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var express = require('express')
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var Port = require('./models/portfolio');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
//mongoose.connect('mongodb://localhost/mp3');
mongoose.connect('mongodb://root:root@ds031922.mongolab.com:31922/final_498', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

// Create our Express application
var app = express();

// Use environment defined port or 4000
var portt = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});


//-authentication-authentication-authentication-authentication-authentication-authentication-authentication--authentication-\


  app.use(express.static('public'));
  //app.use(cookieParser());
 // app.use(session({ secret: 'keyboard cat' }));
  app.use(session({secret:'lets invest',resave: true, saveUninitialized: false}));
  app.use(passport.initialize());
  app.use(passport.session());
  router.use(passport.initialize());
  //app.use(flash());


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
      console.log("-----");
    User.findOne({ email: email }, function (err, user) {
      if (err) { console.log("err"); return done(err); }
      if (!user) { console.log("no user");
        return done(null, false, { message: 'Incorrect Email.' });
      }
      //if (!user.validPassword(password)) { console.log("wrong password");
      //if (user.password != password) { console.log("wrong password");
      var bcrypt = require('bcrypt');
      if (!bcrypt.compareSync(password, user.password)) { console.log("wrong password");
        return done(null, false, { message: 'Incorrect password.' });
      }
        console.log("good");
        //$window.sessionStorage.user = user;
        console.log(user);
        console.log(done);
      return done(null, user);
    });
  }
));

    passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/*app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: true
                                 })
);*/
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { console.log('info: '+info); return res.status(200).json(info); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.status(200).json({message: 'Logged in',"data": user});
    });
  })(req, res, next);
});



//-authentication-authentication-authentication-authentication-authentication-authentication-authentication--authentication-/


router.get('/users',function(req, res,next) {
  var ret = 'User';
  if (typeof req.query.where === 'undefined') ret = ret+'.find({})';
  else ret = ret+'.find('+req.query.where+')';
  if (typeof req.query.sort != 'undefined') ret = ret+'.sort('+req.query.sort+')';
  if (typeof req.query.select != 'undefined') ret = ret+'.select('+req.query.select+')';
  if (typeof req.query.skip != 'undefined') ret = ret+'.skip('+req.query.skip+')';
  if (typeof req.query.limit != 'undefined') ret = ret+'.limit('+req.query.limit+')';
  if (typeof req.query.count != 'undefined') ret = ret+'.count('+req.query.count+')';
  ret = ret + ".exec(function(err,get){if(err) {var msg = '{\"message\": \"Server Error\",\"data\":'+JSON.stringify(get)+'}';"+
      " msg = JSON.parse(msg); res.statusCode = 500; res.json(msg); return next(err);}"+
      "var msg = '{\"message\": \"OK\",\"data\":'+JSON.stringify(get)+'}';msg = JSON.parse(msg);res.statusCode = 200;res.json(msg);});"
  //console.log(ret);
  //console.log("----");
  eval(ret);
  return;
});

router.get('/ports',function(req, res,next) {
  var ret = 'Port';
  if (typeof req.query.where === 'undefined') ret = ret+'.find({})';
  else ret = ret+'.find('+req.query.where+')';
  if (typeof req.query.sort != 'undefined') ret = ret+'.sort('+req.query.sort+')';
  if (typeof req.query.select != 'undefined') ret = ret+'.select('+req.query.select+')';
  if (typeof req.query.skip != 'undefined') ret = ret+'.skip('+req.query.skip+')';
  if (typeof req.query.limit != 'undefined') ret = ret+'.limit('+req.query.limit+')';
  if (typeof req.query.count != 'undefined') ret = ret+'.count('+req.query.count+')';
  ret = ret + ".exec(function(err,get){if(err) {var msg = '{\"message\": \"Server Error\",\"data\":'+JSON.stringify(get)+'}';"+
      " msg = JSON.parse(msg); res.statusCode = 500; res.json(msg); return next(err);}"+
      "var msg = '{\"message\": \"OK\",\"data\":'+JSON.stringify(get)+'}';msg = JSON.parse(msg);res.statusCode = 200;res.json(msg);});"
  eval(ret);
  return;
});

//----------------------------

router.post('/users',function(req,res,next){
    console.log(req.body);
    if(req.body.name == 'undefined' || req.body.name == ''){
        res.status(500).json({message: 'Name is required',"data":[]});
        return;
    }
    if(req.body.email == 'undefined' || req.body.email == ''){
        res.status(500).json({message: 'Email is required',"data":[]});
        return;
    }
    if(req.body.password == 'undefined' || req.body.password == ''){
        res.status(500).json({message: 'Password is required',"data":[]});
        return;
    }
    if(req.body.password){
          var bcrypt = require('bcrypt');
          var hash = bcrypt.hashSync(req.body.password, 10);
          console.log("hash: "+hash);
          req.body.password = hash;
    }
  User.create(req.body,function(err,post){
    if(err) {
        if(err.code == 11000) {
            res.status(500).json({message: 'Email already exists.', "data":[]});
            return;
        }
        var msg = '{"message": "Server Error","data":'+JSON.stringify(post)+'}';
        msg = JSON.parse(msg);
        res.statusCode = 500;
        res.json(msg);
        return next(err);
    }
    /*if(!post.name){
        res.status(500).json({message: 'Name field is required',"data":[]});
        return;
    }
    if(!post.email){
        res.status(500).json({message: 'Email field is required',"data":[]});
        return;
    }*/
    var msg = '{"message": "User Added","data":'+JSON.stringify(post)+'}';
    msg = JSON.parse(msg);
    res.statusCode = 201;
    res.json(msg);
    return;
  });
});

router.options('/users',function(req,res,next){
  res.writeHead(200);
  res.end();
});

router.get('/users/:id',function(req,res,next){
  User.findOne({_id:req.params.id},function(err,get){
    if(err) {
        if (err.path == '_id') {
            var msg = '{"message": "User Not Found","data":[]}';
            msg = JSON.parse(msg);
            res.statusCode = 404;
            res.json(msg);
            return;
        }
        var msg = '{"message": "Server Error","data":'+JSON.stringify(get)+'}';
        msg = JSON.parse(msg);
        res.statusCode = 500;
        res.json(msg);
        return next(err);
    }
    if(JSON.stringify(get) == 'null') {
        var msg = '{"message": "User Not Found","data":[]}';
        msg = JSON.parse(msg);
        res.statusCode = 404;
        res.json(msg);
        return;
    }
    var msg = '{"message": "OK","data":'+JSON.stringify(get)+'}';
    msg = JSON.parse(msg);
    res.statusCode = 200;
    res.json(msg);
    return;
  });
});

router.put('/users/:id',function(req,res,next){
  User.findOneAndUpdate({_id:req.params.id},req.body,function(err,put){
    if(err) {
        if (err.path == '_id') {
            var msg = '{"message": "User Not Found","data":[]}';
            msg = JSON.parse(msg);
            res.statusCode = 404;
            res.json(msg);
            return;
        }
        if(err.code == 11000) {
            res.status(500).json({message: 'Email already exists.', "data":[]});
            return;
        }
        var msg = '{"message": "Server Error",data":'+JSON.stringify(put)+'}';
        msg = JSON.parse(msg);
        res.statusCode = 500;
        res.json(msg);
        return next(err);
    }
    if(JSON.stringify(put) == 'null') {
        var msg = '{"message": "User Not Found","data":[]}';
        msg = JSON.parse(msg);
        res.statusCode = 404;
        res.json(msg);
        return;
    }
    if(!put.name){
        res.status(500).json({message: 'Name field is required',"data":[]});
        return;
    }
    if(!put.email){
        res.status(500).json({message: 'Email field is required',"data":[]});
        return;
    }
    var msg = '{"message": "User Updated",'+'"data":'+JSON.stringify(put)+'}';
    msg = JSON.parse(msg);
    res.statusCode = 200;
    res.json(msg);
    return 200;
  });
});

router.delete('/users/:id',function(req,res,next){
  User.findOneAndRemove({_id:req.params.id},req.body,function(err,del){
    if(err) {
        if (err.path == '_id') {
            var msg = '{"message": "User Not Found","data":[]}';
            msg = JSON.parse(msg);
            res.statusCode = 404;
            res.json(msg);
            return;
        }
        var msg = '{"message": "Server Error",'+'"data":'+JSON.stringify(del)+'}';
        msg = JSON.parse(msg);
        res.statusCode = 500 ;
        res.json(msg);
        return next(err);
    }
    if(JSON.stringify(del) == 'null') {
        var msg = '{"message": "User Not Found","data":[]}';
        msg = JSON.parse(msg);
        res.statusCode = 404;
        res.json(msg);
        return;
    }
    var msg = '{"message": "User Removed",'+'"data":'+JSON.stringify(del)+'}';
    msg = JSON.parse(msg);
    res.statusCode = 200;
    res.json(msg);
    return;
  });
});

//----------------------------

router.post('/ports',function(req,res,next){
  Port.create(req.body,function(err,post){
    if(err) {
        var msg = '{"message": "Server Error","data":'+JSON.stringify(post)+'}';
        msg = JSON.parse(msg);
        res.statusCode = 500;
        res.json(msg);
        return next(err);
    }
    if(!post.name){
        res.status(500).json({message: 'Name field is required',"data":[]});
        return;
    }
    if(!post.deadline){
        res.status(500).json({message: 'Deadline is required',"data":[]});
        return;
    }
    var msg = '{"message": "port Added","data":'+JSON.stringify(post)+'}';
    msg = JSON.parse(msg);
    res.statusCode = 201;
    res.json(msg);
    return;
    });
});

router.options('/ports',function(req,res,next){
  res.writeHead(200);
  res.end();
});

router.get('/ports/:id',function(req,res,next){
  Port.findOne({_id:req.params.id},function(err,get){
    if(err) {
        /*console.log("XX");
        console.log(err);
        console.log("XX");*/
        if (err.path == '_id') {
            var msg = '{"message": "port Not Found","data":[]}';
            msg = JSON.parse(msg);
            res.statusCode = 404;
            res.json(msg);
            return;
        }
        var msg = '{"message": "Server Error","data":"'+JSON.stringify(get)+'"}';
        msg = JSON.parse(msg);
        res.statusCode = 500;
        res.json(msg);
        return next(err);
    }
    if(JSON.stringify(get) == 'null') {
        var msg = '{"message": "port Not Found","data":[]}';
        msg = JSON.parse(msg);
        res.statusCode = 404;
        res.json(msg);
        return 404;
    }
    var msg = '{"message": "OK","data":'+JSON.stringify(get)+'}';
    msg = JSON.parse(msg);
    res.statusCode = 200;
    res.json(msg);
    return;
  });
});

router.put('/ports/:id',function(req,res,next){
  Port.findOneAndUpdate({_id:req.params.id},req.body,function(err,put){
    if(err) {
        if (err.path == '_id') {
            var msg = '{"message": "port Not Found","data":[]}';
            msg = JSON.parse(msg);
            res.statusCode = 404;
            res.json(msg);
            return;
        }
        var msg = '{"message": "Server Error","data":'+JSON.stringify(put)+'}';
        msg = JSON.parse(msg);
        res.statusCode = 500;
        res.json(msg);
        return next(err);
    }
    if(JSON.stringify(put) == 'null') {
        var msg = '{"message": "port Not Found","data":[]}';
        msg = JSON.parse(msg);
        res.statusCode = 404;
        res.json(msg);
        return;
    }
    if(!put.name){
        res.status(500).json({message: 'Name field is required',"data":[]});
        return;
    }
    if(!put.deadline){
        res.status(500).json({message: 'Deadline is required',"data":[]});
        return;
    }
    var msg = '{"message": "port Updated","data":'+JSON.stringify(put)+'}';
    msg = JSON.parse(msg);
    res.statusCode = 200;
    res.json(msg);
    return;
  });
});

router.delete('/ports/:id',function(req,res,next){
  Port.findOneAndRemove({_id:req.params.id},req.body,function(err,del){
    if(err) {
        if (err.path == '_id') {
            var msg = '{"message": "port Not Found","data":[]}';
            msg = JSON.parse(msg);
            res.statusCode = 404;
            res.json(msg);
            return;
        }
        var msg = '{"message": "Server Error,"data":'+JSON.stringify(del)+'}';
        msg = JSON.parse(msg);
        res.statusCode = 500;
        res.json(msg);
        return next(err);
    }
    if(JSON.stringify(del) == 'null') {
        var msg = '{"message": "port Not Found","data":[]}';
        msg = JSON.parse(msg);
        res.statusCode = 404;
        res.json(msg);
        return;
    }
    var msg = '{"message": "port Removed","data":'+JSON.stringify(del)+'}';
    msg = JSON.parse(msg);
    res.statusCode = 200;
    res.json(msg);
    return;
  });
});

// Start the server
app.listen(portt);
console.log('Server running on port ' + portt);
