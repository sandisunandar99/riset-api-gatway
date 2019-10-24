const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const con = mysql.createConnection({
    host: "172.18.0.2",
    user: "root",
    password: "tasikmalaya",
    database: "test"
})

con.connect(function (err, res) {
    if(err){
        res.json({
            erro: err
        });
    };
});

module.exports = con;

