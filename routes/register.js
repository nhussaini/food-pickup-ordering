const express = require('express');
const app        = express();
const bodyParser = require("body-parser");
const router  = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render('register');
  });

  router.post("/", (req, res) => {
    //console.log(req.body)
    //const addUser = [req.body.name, req.body.email, req.body.password, req.body.phone_number];
    const { name, email, password, phone_number} = req.body;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    let params = [name, email, hashedPassword, phone_number];



    return db.query(`
      INSERT INTO users (name, email, password, phone_number)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `, params)
     .then (res => res.rows[0],
    res.redirect("/"));

  });

  return router;
};
