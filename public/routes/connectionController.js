const express = require('express');
var connectionsDB = require('../Utility/connectionsDB');

const route = express.Router();

// render connections page
route.get('/', async function(req,res){
    let connections = await connectionsDB.getConnections();
    let categories = await connectionsDB.getCategories();
    res.render('connections.ejs',{data: connections, categories: categories, session:req.session.theUser});
})

// render connection page
route.get('/connection',async function(req,res){
    let connection = await connectionsDB.getConnection(req.query.id);
    res.render('connection.ejs',{data: connection, session: req.session.theUser});
})

module.exports = route;