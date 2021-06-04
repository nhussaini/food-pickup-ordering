const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const id = req.session["user_id"];

    db.query(
      `SELECT food.*, users.name as user FROM food, users WHERE users.id = $1;`,
      [id]
    )
      .then((foodItems) => {
        const food = foodItems.rows;
        if (id) {
          const user = foodItems.rows[0].user;
          const templateVars = { food, user };
          res.render("index", templateVars);
        }
        const templateVars = { food, user: null };
        res.render("index", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
