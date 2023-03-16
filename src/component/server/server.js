const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://chlrhdms901:_RHdmswodms_4070@cluster0.fyenuf2.mongodb.net/?retryWrites=true&w=majority', function(err, client){
    console.log('listening on 8080');
})