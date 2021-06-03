const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {

    //get the id of the user from session cookie
    const id = req.session['user_id'];

    db.query(`SELECT food.name as food_name, order_food.quantity, order_food.price FROM order_food JOIN food ON food.id = food_id WHERE order_food.order_id = 5;`)
      .then(foodOrders => {
        const orderSummary = foodOrders.rows;
        console.log('order summ:', orderSummary)
        if(id){
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
