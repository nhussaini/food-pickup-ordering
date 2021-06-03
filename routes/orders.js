const express = require("express");
const router = express.Router();
const format = require('pg-format');

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM food;`)
      .then((foodItems) => {
        const food = foodItems.rows;

        //generate orderid here pass it through template vars
        const newOrderId = 1;

        const templateVars = { food, newOrderId };

        res.render("orders", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    console.log('req body', req.body);
    // const exampleReqBody = {
    //   '3': { id: '3', price: '5.99', time: '10', qty: '1' },
    //   '4': { id: '4', price: '12', time: '10', qty: '1' }
    // }

    // geenerate order id, for each item into the order food table
    // change add order into exampleReqbody

    const addOrder = [];

    for (let food_id in req.body) {
      const order_food_info = req.body[food_id];
      addOrder.push([
        // order_food_info.order_id,
        3, //this should become the order id
        order_food_info.id,
        order_food_info.qty,
        order_food_info.price,
      ]);
    }
    const sql = format(`
      INSERT INTO order_food (order_id, food_id, quantity, price)
      VALUES %L
    `, addOrder);

    console.log(sql);

    return db
      .query(sql, [])
      .then((results) => {
        console.log('results', results);
        // results.rows[0];
        res.json({text: 'hi'});
        // res.redirect("/api/order_summary") -> redirect to orders page

      });
  });
  return router;
};
