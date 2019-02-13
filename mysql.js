

var con = require('./db');

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


var tblName = "products";
var item_id = "item_id INT AUTO_INCREMENT PRIMARY KEY"
var product_name = "product_name VARCHAR(100)";
var department_name = "department_name VARCHAR(100)";
var price = "price FLOAT(6,3)";
var stock_quantity = "stock_quantity INT(4)";
// var order_total = "order_total FLOAT(12,3) GENERATED ALWAYS AS (stock_quantity * price)";





con.query("DROP DATABASE IF EXISTS bamazon", function (err, result) {
    if (err) throw err;
    console.log("Database dropped");
});

con.query("CREATE DATABASE bamazon", function (err, result) {
    if (err) throw err;
    console.log("Database created");
});

con.query("USE bamazon", function (err, result) {
    if (err) throw err;
    console.log("Database used");
});

var sql = "CREATE TABLE " + tblName + " (" + item_id + "," + product_name + "," + department_name + "," + price + "," + stock_quantity + ")";
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
});

var sql = `INSERT INTO ` + tblName + ` (product_name,department_name,price,stock_quantity)  VALUES ?  `;

var inventory = [
    ["TV", "Electronics", 500, 20],
    ["Laptop", "Electronics", 300, 30],
    ["Blender", "Kitchen", 60, 10],
    ["Shirt", "Apparel", 10, 50],
    ["Tape", "Home", 4, 100],
    ["Dr Pepper", "Grocery", 2.25, 900],
    ["Peanut Chew", "Checkout", 0.10, 900],
    ["Umbrella", "Misc", 5, 10],
    ["Lawn chair", "Seasonal", 22, 18],
    ["AA Batteries", "Misc", 3, 40]
]

con.query(sql, [inventory], function (err, result) {
    if (err) throw err;

    console.log(result);
    con.end();
});



