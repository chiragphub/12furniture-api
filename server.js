const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./app/config/config.js");
const fileupload = require('express-fileupload');
// const cart_item = require("./app/controllers/cart_item.controller.js");
const app = express();
var cron = require('node-cron');


const corsOptions = { 
  //origin: config.SITE_URL
  origin: '*'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileupload());

app.use(express.static(__dirname + '/uploads'));
//app.use(express.static(__dirname + '/uploads/product'));



// database
const db = require("./app/models");
const Role = db.role;
const Country = db.country;
const State = db.state;
const User = db.user;

db.sequelize.sync().then(() => {
  initial(); // Just use it in development, at the first time execution!. Delete it in production
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hi there, welcome to this tutorial." });
});

// api routes
// require("./app/routes/book.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/variant.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/subcategory.routes")(app);
require("./app/routes/contact.routes")(app);
require("./app/routes/setting.routes")(app);
require("./app/routes/cart_item.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/coupon.routes")(app);

// require("./app/routes/state.routes")(app);
// require("./app/routes/product_type.routes")(app);



// set port, listen for requests
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Just use it in development, at the first time execution!. Delete it in production
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });

  User.create({
    id: 1,
    name: "Admin",
    email: "admin@gmail.com",
    password : "$2a$08$UOwhr9IgIkxTBvoC7zRwnuS9mOmgCDbqM38Isdy/KMCFPFEEjjo0e",
    role_id : 3,
    status : 1,
    created_at : '2022-01-01 11:14:41',
    updated_at : '2022-01-01 11:14:41'
  });

}

// cron.schedule('*/2 * * * *', () => {
//   cart_item.cartCron();
// })
