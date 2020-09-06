const UserConnection = require('./UserConnection');
const condb = require('../utility/connectionsDB');
var usercondb = require('./../utility/userConnectionDB');
var userdb = require('./../utility/userDB');


//function to add/update connection in saved connections page 
     var addConnection = async function(connectionId,userId,rsvp){
        var update=false;                                         
        //check if there is connection already and then update connection with the new rsvp
        var connections = await usercondb.getConnectionbyIds(connectionId, userId);
        for(let i=0; i<connections.length; i++){
            console.log('in update section and the connectionId is', connections[i].connectionId);
            if(connections[i].connectionId == connectionId){
                update=true;
                await this.updateConnection(connectionId, userId, rsvp);
            }else{
                console.log("The User does not exist")
            }
        }
        if(update==false)               //check if there is no connection and then add new connection
        {
            console.log(connectionId+'now being pushed');
            var connections = await condb.getConnection(connectionId);
            console.log('connections in addconnection', connections);
            await usercondb.addUserConnection(connections, userId, rsvp); 
        }
    }

//function to remove connection from saved connections page
   var removeConnection = async function(connectionId,userId){
        await usercondb.removeUserConnection(connectionId, userId);
      
    }

//function to update the connection
     var updateConnection = async function(connectionId, userId, newrsvpvalue){
         console.log('inside updateconnection')
        await usercondb.updateUserConnection(connectionId, userId, newrsvpvalue);
    }


module.exports.addConnection = addConnection;
module.exports.removeConnection = removeConnection;
module.exports.updateConnection = updateConnection;

