const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM food;`)
      .then((foodItems) => {
        const food = foodItems.rows;
        const templateVars = { food };

        res.render("orders", templateVars);
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
