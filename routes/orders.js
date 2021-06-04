/* eslint-disable indent */
/* eslint-disable camelcase */
const express = require("express");
const router = express.Router();
const format = require("pg-format");
const dotenv = require("dotenv");
const envVar = dotenv.config({ path: "./.env" });
const accountSid = envVar.TWILIO_ACCOUNT_SID;
const authToken = envVar.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

module.exports = (db) => {
  router.get("/", (req, res) => {
    const id = req.session["user_id"];
    db.query(
      `SELECT food.*, users.phone_number FROM food, users WHERE users.id = ${id};`
    )
      .then((foodItems) => {
        const food = foodItems.rows;
        const templateVars = { food };

        const phoneNumber = foodItems.rows[0].phone_number;
        const foodDuration = foodItems.rows[0].time;
        res.render("orders", templateVars);

        const message = function () {
          client.messages
            .create({
              body: "Food is ready for pickup!",
              from: "+18077906750",
              to: phoneNumber,
            })
            .then((message) => console.log(message.sid));
        };
        setTimeout(message, foodDuration * 1000);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    console.log("req body", req.body);

    res.redirect("/api/summary/");

    const order = [req.session["user_id"], "true", 10];

    console.log("orders", order);

    const sql1 = format(
      `
      INSERT INTO orders (user_id, order_status, total_price)
      VALUES %L
      RETURNING id
    `,
      [order]
    );

    console.log(sql1);

    const results = db
      .query(sql1, [])
      .then((results) => {
        console.log("results", results.rows[0].id);
        let order_id = results.rows[0].id;

        const addOrder = [];

        for (let food_id in req.body) {
          const order_food_info = req.body[food_id];
          addOrder.push([
            order_id,
            order_food_info.id,
            order_food_info.qty,
            order_food_info.price,
          ]);
        }
      })
      .then((results) => {
        console.log("results2", results.rows[0].id);
      });

    const sql = format(
      `
      INSERT INTO order_food (order_id, food_id, quantity, price)
      VALUES %L
    `,
      addOrder
    );

    console.log(sql);

    return db.query(sql, []).then((results) => {
      console.log("results", results);
      res.json({ text: "hi" });
    });
  });
  return router;
};
