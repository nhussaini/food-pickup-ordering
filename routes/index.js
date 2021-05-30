const express = require('express');
const router  = express.Router();

//route for the index page
module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM food;`)
      .then(foodItems => {
        const food = foodItems.rows;
        console.log('food', food);
        const templateVars = { food };

        res.render('index', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
