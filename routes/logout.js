const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    req.session["user_id"] = null;
    return res.redirect("/api/index");
  });
  return router;
};
