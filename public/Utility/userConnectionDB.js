const userConObj = require('../models/UserConnection');
const condb = require('./connectionsDB');
const userdb = require('./userDB');


// function to add new user connection in the db wrt the user
var addUserConnection = async function(conobj, userobj, rsvp){
        console.log('in addUserConnection' + conobj + userobj + rsvp);
    var user = await userdb.getUser(userobj);
    console.log('check userId exists or not');
        if(user.userId == userobj){
        var addusercon = new userConObj({       
            userId: userobj,
            connectionId: conobj[0].connectionId,
            connectionName: conobj[0].connectionName,
            connectionTopic: conobj[0].connectionTopic,
            rsvp: rsvp
        });
        console.log('before saving');
        await addusercon.save(function(err, addedusercon) { 
            console.log('after saving added user');  
            if(err) return console.error(err);
            console.log('added user', addedusercon);
        });
     }
}

//function to update the user connection if found any 
var updateUserConnection = async function(connectionId, userId, newRsvp) {
    console.log("update rsvp" +connectionId+userId+newRsvp)
    var update = false;
    await userConObj.findOneAndUpdate(
        {userId: userId, connectionId: connectionId },
        {
            $set: { rsvp: newRsvp}
        }
    ).exec().then((obj) => {
        if(obj) {
            console.log(obj);
            update = true;
        }
    }).catch((err) => {
        console.log(err);
    });
    return update;
}


//function to remove the user connection from db
var removeUserConnection = async function(connectionId, userId){
   return await userConObj.deleteOne(
        {userId: userId, connectionId: connectionId} , function(err){
            if(err) return console.error(err);
        });
}


// function to get user connection from db
var getUserConnection = function(userId) {
    return new Promise((resolve, reject) => {
        var usercon = [];
         userConObj.find({userId: userId}).then(async data =>{
             usercon = data;
             console.log('getuserconnection details', usercon);
             resolve(usercon);
         })
         .catch(err => {return reject(err);})
    });
}

//function to get all the connections of the particular user from db
var getConnectionbyIds = function(connectionId, userId) {
    return new Promise((resolve, reject) => {
        var con = [];
        userConObj.find({connectionId:connectionId, userId:userId}).exec().then( async data => {
            con = data;
            console.log("getconnectionId's details", con);
            resolve(con);
        })
        .catch(err => {return reject(err);})
    });
}

module.exports.getUserConnection = getUserConnection;
module.exports.addUserConnection = addUserConnection;
module.exports.updateUserConnection = updateUserConnection;
module.exports.removeUserConnection = removeUserConnection;
module.exports.getConnectionbyIds = getConnectionbyIds;