const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const envVar = dotenv.config({ path: './.env' })
const accountSid = envVar.TWILIO_ACCOUNT_SID;
const authToken = envVar.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);




module.exports = (db) => {
  router.get("/", (req, res) => {
    const id = req.session['user_id'];
    console.log('id:', id)
    db.query(`SELECT food.*, users.phone_number FROM food, users WHERE users.id = ${id};`)
      .then((foodItems) => {
        const food = foodItems.rows;
        const phoneNumber = foodItems.rows[0].phone_number;
        const foodDuration = foodItems.rows[0].time;
        const templateVars = { food };
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
