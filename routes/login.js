const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = { status: "", message: "" };
    res.render("login", templateVars);
  });

  router.post("/", (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM users WHERE email = $1;`, [email])
      .then((data) => {
        const user = data.rows[0];

        if (bcrypt.compareSync(password, user.password)) {
          req.session["user_id"] = user.id;
          return res.redirect("/");
        }
        const templateVars = {
          status: "error",
          message: "Your email or password is wrong",
        };
        res.render("login", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
