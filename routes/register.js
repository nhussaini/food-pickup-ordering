const express = require('express');
const router  = express.Router();
const bcrypt = require('bcryptjs');

const saltRounds = 10;



module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {message: ''};

    res.render('register', templateVars);
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
     .then (data => {
       const user = data.rows[0];
       console.log(user);
       console.log(req.session);
       req.session['user_id'] = user.id;
       //add the user id in the cookie
       return res.redirect("/api/index");
     }
    );

  });

  return router;
};
