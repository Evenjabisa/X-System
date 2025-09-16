const express = require("express");
const app = express();
const port = process.env.PORT || 3001;


const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("Public"));

var methodOverride = require('method-override')
app.use(methodOverride('_method'))
const allRoutes = require('./routes/allRoutes');
const addUserRoutes = require('./routes/addUser');


// cookieParser
var cookieParser = require('cookie-parser')
app.use(cookieParser())
require('dotenv').config()

app.use(express.json())




mongoose
  .connect(
    process.env.MONGODB_URL 
    )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


  app.use(allRoutes)
  app.use( "/user/add.html", addUserRoutes);
