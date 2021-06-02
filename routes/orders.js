const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const envVar = dotenv.config({ path: './.env' })
const accountSid = envVar.TWILIO_ACCOUNT_SID;
const authToken = envVar.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


client.messages
  .create({
     body: 'twilio test',
     from: '+18077906750',
     to: '+14167320712'
   })
  .then(message => console.log(message.sid));

module.exports = (db) => {
  router.get("/", (req, res) => {
    const id = req.session['user_id'];
    console.log('id:', id)
    db.query(`SELECT food.*, users.phone_number FROM food, users WHERE users.id = ${id};`)
      .then((foodItems) => {
        const food = foodItems.rows;
        const templateVars = { food };
        res.render("orders", templateVars);
        console.log('food items', foodItems.rows)
        
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

    router.post("/", (req, res) => {
      //console.log(req.body)
      const addOrder = [
        req.body.order_id,
        req.body.food_id,
        req.body.quantity,
        req.body.price,
      ];

      return db
        .query(
          `
            INSERT INTO order_food (order_id, food_id, quantity, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
          addOrder
        )
        .then((res) => res.rows[0], res.redirect("/"));
    });
  });
  return router;
};
