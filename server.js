// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");

const cookieSession = require("cookie-session");

// Cookie Session Middleware
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
const indexRoutes = require("./routes/index");
const registerRoutes = require("./routes/register");
const ordersRoutes = require("./routes/orders");
const logoutRoutes = require("./routes/logout");
const orderSummaryRoutes = require("./routes/order_summ");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/login", loginRoutes(db));
app.use("/api/index", indexRoutes(db));
app.use("/api/register", registerRoutes(db));
app.use("/api/orders", ordersRoutes(db));
app.use("/api/logout", logoutRoutes(db));
app.use("/api/summary", orderSummaryRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
