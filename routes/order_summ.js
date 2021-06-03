const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {

    //get the id of the user from session cookie
    const id = req.session['user_id'];

    //select food  and the current logged in user from database.
    db.query(`SELECT order_food.*, food.name as food_name FROM order_food JOIN food ON food_id = food.id WHERE order_food.id = 1;`)
      .then(foodOrders => {
        const orderSummary = foodOrders.rows;
        console.log('order summ:', orderSummary)
        if(id){
          //const user = foodOrders.rows[0].user;
          const templateVars = { orderSummary };
         res.render('order_summ', templateVars);
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
