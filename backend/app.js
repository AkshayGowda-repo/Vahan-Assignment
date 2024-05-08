const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const entityRoutes = require("./routes/entity.routes");
const db = require("./models");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync();

app.use("/api", entityRoutes);

module.exports = app;
