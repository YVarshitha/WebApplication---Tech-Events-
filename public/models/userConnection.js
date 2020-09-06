var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create user connection schema
var userConnectionSchema = new Schema({
    userId:{
        type : String,
        required: true
    },

   connectionId:{
       type : String,
        required: true
   },

   connectionName: {
       type : String
        // required: true
   },
  
   connectionTopic: {
        type : String
        // required: true
    },

   rsvp: {
       type : String,
        required: true
   }
});

var UserConnection = mongoose.model('UserConnection', userConnectionSchema,'userconnection');

module.exports = UserConnection;