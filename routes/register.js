const express = require('express');
const app        = express();
const bodyParser = require("body-parser");
const router  = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = (db) => {
  router.get("/", (req, res) => {
    // db.query(`SELECT * FROM users;`)
    //   .then(data => {
    //     const users = data.rows;
    //     res.json({ users });
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
    res.render('register');
  });

  router.post("/", (req, res) => {
    //console.log(req.body)
    const addUser = [req.body.name, req.body.email, req.body.password, req.body.phone_number];

    return db.query(`
      INSERT INTO users (name, email, password, phone_number)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `, addUser)

     .then (res => res.rows[0],
    res.redirect("/"));

  });
  
  return router;
};
