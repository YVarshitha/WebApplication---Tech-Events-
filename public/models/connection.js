var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create connection schema
var connectionSchema = new Schema({
    connectionId: {
        type: String,
        required: true
    },

    connectionTopic: {
        type: String,
        required: true
    },

    connectionName: {
        type: String,
        required: true
    },

    hostedBy: {
        type: String
    },

    connectionDetails: {
        type: String
    },

    location: {
        type: String
    },

    date: {
        type: String
    },

    starttime: {
        type: String
    },
    
    endtime: {
        type: String
    }
});

var Connection = mongoose.model('Connection', connectionSchema, 'connection');

module.exports = Connection;



