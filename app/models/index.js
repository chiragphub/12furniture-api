const config = require("../config/config.js");
const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  config.db.DB_NAME,
  config.db.DB_USER,
  config.db.DB_PASS,
  {
    host: config.db.DB_HOST,
    dialect: config.db.dialect,
    operatorsAliases: false,

    poll: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

// db.books = require("./book.model.js")(sequelize, Sequelize, DataTypes);
db.user = require("./user.model.js")(sequelize, Sequelize, DataTypes);
db.products = require("./product.model.js")(sequelize, Sequelize, DataTypes);
db.variant = require("./variant.model.js")(sequelize, Sequelize, DataTypes);
db.variant_value = require("./variant_value.model.js")(sequelize, Sequelize, DataTypes);
db.category = require("./category.model.js")(sequelize, Sequelize, DataTypes);
db.subcategory = require("./subcategory.model.js")(sequelize, Sequelize, DataTypes);
db.contact = require("./contact.model.js")(sequelize, Sequelize, DataTypes);
db.setting = require("./setting.model.js")(sequelize, Sequelize, DataTypes);
db.cart_items = require("./cart_item.model.js")(sequelize, Sequelize, DataTypes);
db.order = require("./order.model.js")(sequelize, Sequelize, DataTypes);
db.orderItem = require("./order_item.model.js")(sequelize, Sequelize, DataTypes);
db.coupon = require("./coupon.model.js")(sequelize, Sequelize, DataTypes);
db.googleUser = require("./googleUser.model.js")(sequelize, Sequelize, DataTypes);

// db.checkouts = require("./checkout.model.js")(sequelize, Sequelize, DataTypes);
// db.items = require("./item.model.js")(sequelize, Sequelize, DataTypes);
db.role = require("./role.model.js")(sequelize, Sequelize, DataTypes);
// db.country = require("./country.model.js")(sequelize, Sequelize, DataTypes);
// db.state = require("./state.model.js")(sequelize, Sequelize, DataTypes);
// db.product_type = require("./product_type.model.js")(sequelize, Sequelize, DataTypes);
// db.product_tags = require("./product_tags.model.js")(sequelize, Sequelize, DataTypes);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
