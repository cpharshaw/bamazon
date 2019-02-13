var mysql = require('mysql');


var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "bamazon",
    password: "1samsam1"
});



module.exports = con;
