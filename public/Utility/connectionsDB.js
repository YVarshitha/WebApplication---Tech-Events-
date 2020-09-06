const conObj = require('../models/Connection');


//function to get all connections from db
var getConnections = async function() {
    var connectionslist = [];
   await conObj.find().exec()
   .then((connections) => {
       connectionslist = connections;
       //console.log('connections  list',connectionslist);
   })
   .catch((err) =>{
       console.log(err);
   });

   return connectionslist;
}


//function to get connection topics from db
var getCategories = async function() {
    var connectiontopiclist = await conObj.find().distinct('connectionTopic', function(err,connectionTopics){
        connectiontopiclist = connectionTopics;
        //console.log('connection topic list',connectiontopiclist);
    })
    .catch((err) => {
        console.log(err);
    });
    return connectiontopiclist; 
}


//function to get one connection from db
var getConnection = async function(connectionId) {
    console.log("connectionid ", connectionId);
    var oneconnection = await conObj.find({connectionId : connectionId}, function(err, connection){
        oneconnection = connection;
        console.log('connection is', oneconnection );
    })
    .catch((err) => {
        console.log(err);
    });
    return oneconnection;
}

module.exports.getConnections = getConnections;
module.exports.getCategories = getCategories;
module.exports.getConnection = getConnection;


