
var con = require('./db');

con.connect(function (err) {
    if (err) throw err;

    con.query("USE bamazon", function (err, result) {
        if (err) throw err;
        // console.log("Database used");
    });
});

var inquirer = require('inquirer');

// var orderPrompt = function () {
inquirer.prompt([
    {
        type: "list",
        name: "mgrOption",
        message: "Choose an option",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }
]).then(function (res) {
    if (res.mgrOption === "View Products for Sale") {
        viewProducts();
    } else if (res.mgrOption === "View Low Inventory") {
        viewLowInv();
    } else if (res.mgrOption === "Add to Inventory") {
        addInvPrompt();
    } else if (res.mgrOption === "Add New Product") {
        addPrompt();
    }
    // console.log('ond');
});
// }


var addPrompt = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Enter a product name",
        },
        {
            type: "input",
            name: "department_name",
            message: "Enter the department",
        },
        {
            type: "input",
            name: "price",
            message: "Enter the price",
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "Enter the stock level",
        }

    ]).then(function (res) {

        addNewProduct(res.product_name, res.department_name, res.price, res.stock_quantity);

    });
}


var addInvPrompt = function () {
    inquirer.prompt([

        {
            type: "input",
            name: "id",
            message: "What is the ID of the product to which you would like to add inventory?",

        },

        {
            type: "input",
            name: "added",
            message: "How many units are you adding?",
            validate: function (input) {
                if (input > 0) {
                    return true;
                } else {
                    return "Enter a number greather than 0.";
                }
            }            
        }

    ]).then(function (res) {
        addInv (res.id, res.added);
    });
}


function viewProducts() {
    var sql = "select * from products";

    con.query(sql, function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var listing =
                "Item ID: " + res[i].item_id + " // " +
                "Product: " + res[i].product_name + " // " +
                "Department: " + res[i].department_name + " // " +
                "Price: " + res[i].price + " // " +
                "Number in stock: " + res[i].stock_quantity;

            console.log(listing);

        }
        con.end();

    });

};

function viewLowInv() {
    var sql = "select * from products where stock_quantity < 5;";

    con.query(sql, function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var listing =
                "Item ID: " + res[i].item_id + " // " +
                "Product: " + res[i].product_name + " // " +
                "Department: " + res[i].department_name + " // " +
                "Price: " + res[i].price + " // " +
                "Number in stock: " + res[i].stock_quantity;

            console.log(listing);
            // console.log("low");

        }
        con.end();

    });

};


function addNewProduct (product_name, department_name, price, stock_quantity) {

    var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";

    con.query(sql, [product_name, department_name, price, stock_quantity], function (err, res) {
        if (err) throw err;

        if (res.affectedRows > 0) {
            console.log("Product added.")
        } else {
            console.log("Check the products table to ensure product was added.");
        }

    });

    con.query("select * from products where item_id = (select max(item_id) from products)", function (err, res) {
        if (err) throw err;
        console.log(res[0]);
        con.end();
    });      

};


function addInv (id, added) {

    var sql = "UPDATE bamazon.products SET stock_quantity = (stock_quantity + ?) WHERE item_id = ?";

    con.query(sql, [added, id], function (err, res) {
        if (err) throw err;
        console.log("Inventory added");
    });

    con.query("select * from products where item_id = ?", id, function (err, res) {
        if (err) throw err;
        console.log(res);
        con.end();
    });    
}