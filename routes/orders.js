/* eslint-disable indent */
/* eslint-disable camelcase */
const express = require("express");
const router = express.Router();
const format = require('pg-format');
const dotenv = require('dotenv');
const envVar = dotenv.config({ path: './.env' });
const accountSid = envVar.TWILIO_ACCOUNT_SID;
const authToken = envVar.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports = (db) => {
  router.get("/", (req, res) => {
    const id = req.session['user_id'];
    //console.log('id:', id);
    db.query(`SELECT food.*, users.phone_number FROM food, users WHERE users.id = ${id};`)
      .then((foodItems) => {
        const food = foodItems.rows;

        //generate orderid here pass it through template vars

        const templateVars = { food };

        const phoneNumber = foodItems.rows[0].phone_number;
        const foodDuration = foodItems.rows[0].time;
        res.render("orders", templateVars);

        const message = function() {
        client.messages
        .create({
          body: 'Food is ready for pickup!',
          from: '+18077906750',
          to: phoneNumber
        })
        .then(message => console.log(message.sid));
      };
      setTimeout(message, foodDuration * 1000);


      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    console.log('req body', req.body);
    
    //res.end('hello');
   res.redirect('/api/summary/');
    

    // const exampleReqBody = {
    //   '3': { id: '3', price: '5.99', time: '10', qty: '1' },
    //   '4': { id: '4', price: '12', time: '10', qty: '1' }
    // }

    // geenerate order id, for each item into the order food table
    // change add order into exampleReqbody

    // const order = [
    //   req.session['user_id'], 'true',
    //   Object.values(req.body).reduce((sum, currentItem) => {
    //     return (currentItem.price)
    //     //return (sum + parseFloat(currentItem.price));
    //   }, 0)];

    const order = [
      req.session["user_id"], "true",
      
    ]

   console.log('orders', order);

    const sql1 = format(`
      INSERT INTO orders (user_id, order_status, total_price)
      VALUES %L
      RETURNING id
    `, [order]);

    console.log(sql1);

    const results = db.query(sql1, []);

    // console.log('result:', results.rows[0].id);
    let order_id = results.rows[0].id;
    console.log(order_id)

    const addOrder = [];

    for (let food_id in req.body) {
      const order_food_info = req.body[food_id];
      addOrder.push([
        // order_food_info.order_id,
       //this should become the order id
        order_id,
        order_food_info.id,
        order_food_info.qty,
        order_food_info.price
      ]);
    }

    const sql = format(`
      INSERT INTO order_food (order_id, food_id, quantity, price)
      VALUES %L
    `, addOrder);
    
    console.log(sql);
    return;
    
    return db
      .query(sql, [])
      .then((results) => {
        console.log('results', results);
        

        //return res.redirect("/api/summary");
        // results.rows[0];
        res.json({text: 'hi'});
      });
    

      
  });
  return router;
};
