const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const envVar = dotenv.config({ path: "./.env" });
const accountSid = envVar.TWILIO_ACCOUNT_SID;
const authToken = envVar.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

module.exports = (db) => {
  router.get("/", (req, res) => {
    const id = req.session["user_id"];

    db.query(
      `SELECT food.name as food_name, order_food.quantity, order_food.price, users.phone_number FROM order_food JOIN food ON food.id = food_id, users WHERE order_food.order_id = 5 AND users.id = ${id};`
    )
      .then((foodOrders) => {
        const orderSummary = foodOrders.rows;
        if (id) {
          const templateVars = { orderSummary };
          res.render("order_summ", templateVars);
        }
        const phoneNumber = orderSummary.rows[0].phone_number;
        const message = function () {
          client.messages
            .create({
              body: "Food is ready for pickup!",
              from: "+18077906750",
              to: phoneNumber,
            })
            .then((message) => console.log(message.body));
        };
        setTimeout(message, 4000);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
