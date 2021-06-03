const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const format = require('pg-format');
=======
const dotenv = require('dotenv');
const envVar = dotenv.config({ path: './.env' })
const accountSid = envVar.TWILIO_ACCOUNT_SID;
const authToken = envVar.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

>>>>>>> master

module.exports = (db) => {
  router.get("/", (req, res) => {
    const id = req.session['user_id'];
    console.log('id:', id)
    db.query(`SELECT food.*, users.phone_number FROM food, users WHERE users.id = ${id};`)
      .then((foodItems) => {
        const food = foodItems.rows;
<<<<<<< HEAD

        //generate orderid here pass it through template vars
        const newOrderId = 1;

        const templateVars = { food, newOrderId };

=======
        const phoneNumber = foodItems.rows[0].phone_number;
        const foodDuration = foodItems.rows[0].time;
        const templateVars = { food };
>>>>>>> master
        res.render("orders", templateVars);
        
        const message = function () {
        client.messages
        .create({
          body: 'Food is ready for pickup!',
          from: '+18077906750',
          to: phoneNumber
        })
        .then(message => console.log(message.sid));
      }
      setTimeout(message, foodDuration * 1000);


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
