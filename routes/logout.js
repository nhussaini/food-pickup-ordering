const express = require('express');
const router  = express.Router();






//get /api/login route
module.exports = (db) => {
  //post /api/logout route
router.post("/", (req, res) => {
  req.session['user_id'] = null;
  return res.redirect("/api/index");
});



  return router;

};

