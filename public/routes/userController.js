
const express = require('express');
const bodyParser = require('body-parser');
const condb = require('../utility/connectionsDB');
const usercondb = require('../utility/userConnectionDB');
const userdb = require('../utility/userDB');
const userObj = require('../models/User');
var userprofileObj = require('../models/userProfile');
var userConnection = require('./../models/UserConnection');
const conObj = require('../models/Connection');
var random = require('random-int');
var connectionlist = [];
var userdetails;

const route = express.Router();
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator');


// add/update saved connections when session exists and display saved connections page
route.get('/rsvp', async function (req, res) {
  if (req.session.theUser == undefined) {
    res.redirect('/login');
  } else if (req.session.theUser) {
    if (Object.keys(req.query)[0] === 'connectionId') {
      var connectionId = req.query.connectionId;
      var userId = req.query.userId;
      var rsvp = req.query.rsvp;
      console.log('before addConnection ' + connectionId + userId + rsvp);
      await userprofileObj.addConnection(connectionId, userId, rsvp);
      console.log('after addConnection');
      var userdetails = usercondb.getUserConnection(userId);
      console.log('rsvp invoked', userdetails);
      console.log('ok not ok' + JSON.stringify(userdetails));
      res.redirect('/userprofile');
    }
  }
});


// redirect to connecton page for update the rsvp value of the user
route.get('/update', function (req, res) {
  if (Object.keys(req.query)[0] === 'connectionId') {
    var id = req.query.connectionId;
    res.redirect('/connections/connection?connectionId=' + id);
  }
});


//delete the saved connection of the user and display the saved connections page with the connections (if any) 
route.get('/delete', async function (req, res) {
  if (req.session.theUser) {
    console.log('DELETE ROUTER INVOKED 1');
    usercondb.removeUserConnection(req.query.id, req.query.userid).then(success => {
      // usercondb.getUserConnection(req.query.userid);
      res.redirect('/userprofile');
    })
  }
});


//logout from the session and application and redirect to home/index page
route.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      res.negotiate(err)
    }
    userprofileObj.connections = [];
    res.redirect('/');
  })
});


// create new connection to the db and render it in connections page
route.post('/newconnection', urlEncodedParser, jsonParser, [
  check('topic').custom(value => /^[a-zA-Z0-9 ]+$/.test(value)).withMessage('Connection Topic should be Alphanumeric and can contain spaces').isLength({ min: 2, max: 50 }).withMessage('Connection Topic (Min Length - 2, Max Length - 50)'),
  check('name').custom(value => /^[a-zA-Z]+$/.test(value)).withMessage('Connection Name should be alphabets and can contain spaces').isLength({ min: 2, max: 50 }).withMessage('Connection Name (Min Length - 2, Max Length - 50)'),
  check('details').custom(value => /^[a-zA-Z0-9 ]+$/.test(value)).withMessage('Connection details should be alphanumeric and can contain spaces').isLength({ min: 2, max: 500 }).withMessage('Connection details (Min Length - 2, Max Length - 500)'),
  check('location').custom(value => /^[a-zA-Z]+$/.test(value)).withMessage('Connection location should be alphabets and can contain spaces').isLength({ min: 2, max: 50 }).withMessage('Connection location (Min Length - 2, Max Length - 50)'),
  check('hostname').isAlpha().withMessage('Host Name should be only alphabetical chars').isLength({ min: 2, max: 50 }).withMessage('Host name (Min Length - 2, Max Length - 50)'),
  check('starttime').exists(),
      check('endtime').exists(),
      check('date').custom((value, {req}) => {
        // today_date = value;
        // let today = new Date().toLocaleDateString();
        let today = new Date().toISOString().slice(0, 10)
        console.log(today);
        console.log(value);
        console.log(req.body.date)
        if(req.body.date < today){
          throw new Error('Date should be either today or greater than today');
        }else{
        return true;
        }
      }),
      check('starttime').custom((value, { req }) => {
        arr1 = value.split(':');
        starthr = parseInt(arr1[0]);
        startmin =  parseInt(arr1[1]);
        arr2 = req.body.endtime.split(':');
        endhr =  parseInt(arr2[0]);
        endmin =  parseInt(arr2[1]);
        if (starthr > endhr) {
          throw new Error('End time should not be less than start time');
        }
        if (starthr == endhr) {
          if (startmin > endmin) {
            throw new Error('End time should not be less than start time');
          }
        }
        return true;
      })
  ],
  async function (req, res) {
    var errors = validationResult(req);
      if (!errors.isEmpty()) {
          console.log(errors.array());
          res.render('newConnection', {session:req.session.theUser, error:errors.array()});
      }else{
  
    obj = new conObj({
      connectionId: random(1, 999),
      connectionName: req.body.name,
      connectionTopic: req.body.topic,
      hostedBy: req.body.hostname,
      location: req.body.location,
      connectionDetails: req.body.details,
      date: req.body.date,
      starttime: req.body.starttime,
      endtime: req.body.endtime
    })
  
    await obj.save(async function (err, obj) {
      if (err) { return console.error(err) }
      let connections = await condb.getConnections();
      let categories = await condb.getCategories();
      res.render('connections', { data: connections, categories: categories, session: req.session.theUser })
    })
  }
  });


//to validate whether the username and password exist in DB
route.post('/', urlEncodedParser, jsonParser, [
   check('userId').isEmail().withMessage('User Name must be an email with @ and .com'),
   check('password').isAlphanumeric().withMessage('Password must be only alphabetical and numerical chars')
],
async function(req, res){
  var errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.render('login',{session:req.session.theUser,error:errors.array()});
        }else{
  if(req.session.theUser == undefined){
    var users = await userdb.getUsers();
    console.log('users in db', users);
    for (i = 0; i < users.length; i++){
      console.log('userId', users[i].userId, 'req.body.userId', req.body.userId);
      if (users[i].userId == req.body.userId) {
        console.log('user already exist in db');
        if(users[i].userPassword == req.body.password){
          var userdetails = await usercondb.getUserConnection(req.body.userId);
          console.log('login invoked', userdetails);
          // req.session.theUser = userdetails;
          // if(req.session.theUser){
          res.redirect('/userprofile');
          // }
        }else{
          console.log('Incorrect password');
          res.render('login',{session:req.session.theUser,error:[{'msg': 'Incorrect password',}]});
        }              
      }else {
        console.log('Incorrect username/user does not exist');
        res.render('login',{session:req.session.theUser,error:[{'msg': 'Incorrect username/user does not exist in DB',}]});
      }
        res.render('login',{session:req.session.theUser,error:[{'msg': 'Incorrect username/password or User does not exist in DB',}]});

    }
    res.render('login',{session:req.session.theUser,error:[{'msg': 'Incorrect username/password or User does not exist in DB',}]});
  }
}
});


// Myconnections page to display based on teh user session and get the userconnections from db to display based on user
route.get('/', async function (req, res) {
  if (req.session.theUser == undefined) {
    var user = await userdb.getUsers();
    console.log('getUsers for myconnections', user, 'single user', user[1]);
    var userdata = user[0];
    req.session.theUser = new userObj(userdata);
    var userdetails = await usercondb.getUserConnection(req.session.theUser.userId);
    req.session.theUser.userdetails = userdetails;
    console.log('check' + req.session.theUser.userdetails);
    res.render('savedConnections', { data: req.session.theUser.userdetails, session: req.session.theUser });
  } else if (req.session.theUser) {
    var usercondetails = await usercondb.getUserConnection(req.session.theUser.userId);
    console.log('usercondetails for myconnections to display', usercondetails);
    if (usercondetails.length > 0) {
      for (i = 0; i < usercondetails.length; i++) {
        req.session.theUser.userdetails = usercondetails;
        console.log('check if else   ' + i + req.session.theUser.userdetails);
        res.render('savedConnections', { data: req.session.theUser.userdetails, session: req.session.theUser });
      }
    } else {
      res.render('savedConnections', { data: usercondetails, session: req.session.theUser });
    }
  }
});


module.exports = route;