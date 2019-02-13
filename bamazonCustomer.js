
var con = require('./db');

con.connect(function (err) {
    if (err) throw err;

    con.query("USE bamazon", function (err, result) {
        if (err) throw err;
        // console.log("Database used");
    });
});

var inquirer = require('inquirer');

var orderPrompt = function () {
    inquirer.prompt([

        {
            type: "input",
            name: "id",
            message: "What is the ID of the product you would like to buy?",
            validate: function (input) {
                if (input >= 1 && input <= 10) {
                    return true;
                } else {
                    return "Product does not exist.  Enter an ID between 1 and 10.";
                }
            }
        },

        {
            type: "input",
            name: "numUnitsOrdered",
            message: "How many units would you like to buy?"
        }

    ]).then(function (res) {
        checkDb(res.id, res.numUnitsOrdered);
        // query(res.id, res.numUnits);
    });
}


orderPrompt();


var checkDb = function (id, numUnitsOrdered) {
    var sql = "select * from products where item_id = ?";
    if (id > 10) {
        console.log("Product does not exist.  Please try again.");
        orderPrompt();
    } else {
        con.query(sql, id, function (err, res) {
            if (err) throw err;

            var numInStock = res[0].stock_quantity;

            if (numInStock > 0 && numInStock >= numUnitsOrdered) {
                order(id, numUnitsOrdered, numInStock);
            } else {
                console.log("Insufficient quantity!");
                con.end();
            }
        });
    }
}




var resultsQuery = function (id, numUnitsOrdered) {
    var sql = "select * from products where item_id = ?";

    con.query(sql, id, function (err, res) {
        if (err) throw err;
        var results = res[0];

        console.log("Order has been processed.  Your total is: " + numUnitsOrdered * results.price);
    });
}



var order = function (id, numUnitsOrdered, numInStock) {

    var leftover = numInStock - numUnitsOrdered;

    var sql = "UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?";

    con.query(sql, [leftover, id], function (err, res) {
        if (err) throw err;

        resultsQuery(id, numUnitsOrdered);
        con.end();
    });
}


