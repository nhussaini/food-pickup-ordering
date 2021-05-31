const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;


//get /api/login route
module.exports = (db) => {

  router.get("/", (req, res) => {
    const templateVars = {status: '', message: ''}
    res.render('login', templateVars);
  });

  //post /api/login route
  router.post("/", (req, res) => {

    //get the email and password from req.body
    const { email, password } = req.body;
    db.query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then(data =>{
      const user = data.rows[0];

      //if the password matches, redirect to "/"
      if (bcrypt.compareSync(password, user.password)) {
        req.session['user_id'] = user.id;
        return res.redirect("/");
      }
      //if the passwords don't match, send the error object to the /api/login
      const templateVars = {status: 'error', message: 'Your email or password is wrong'};
      res.render('login', templateVars);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    })

  });

  return router;

};
