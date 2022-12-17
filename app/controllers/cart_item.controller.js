const db = require("../models");
const CartItem = db.cart_items;
const { Sequelize, Op } = require("sequelize");
const config = require("../config/config.js");
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

// Create and Save a new Book
exports.create = async (req, res) => {
  // Create a product
  const product = {
    session_id: req.body.session_id,
    product_id: req.body.product_id,
    qty: req.body.qty,
    product: req.body.product,
    variantData: req.body.variantData
  };

  var query = 'select * from cart_items WHERE session_id = ' + req.body.session_id + ' AND product_id = ' + req.body.product_id + ' GROUP BY id';
  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {

    if (Object.keys(rows).length > 0) {
      CartItem.update(
        {
          qty: rows[0].qty + req.body.qty,   
          variantData: req.body.variantData,
        },
        { where: { id: rows[0].id } }
      )
      var query2 = 'select * from cart_items WHERE id=' + rows[0].id + ' GROUP BY id';
      sequelize.query(query2, { type: sequelize.QueryTypes.SELECT }).then(function (newrows) {
        res.send({ status: 1, data: newrows, insertId: rows[0].id });
      })
        .catch(err => {
          res.send({ status: 1, data: [], insertId: rows[0].id });
        })

    } else {// Save product in database
      CartItem.create(product)
        .then(data => {
          res.send({ status: 1, data: data, insertId: data.id });
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the Product."
          });
        });

    }
  })
    .catch(err => {
      // Save product in database
      CartItem.create(product)
        .then(data => {
          res.send({ status: 1, data: data, insertId: data.id });
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the Product."
          });
        });
    });
};


exports.findAll = async (req, res) => {
  var query = 'select p.*,ci.id as cart_id,ci.qty as cart_qty,ci.variantData,ci.product as product,ci.session_id as uniqueID from cart_items  as ci left join products as p on p.id = ci.product_id where p.status = 1 AND ci.session_id = "' + req.body.session_id + '"';
  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
    res.json({ status: 1, data: rows, total: rows.count });
  }).catch(err => {
    res.send({ status: 0, data: [] });
  });

};

exports.findOne = (req, res) => {
  const id = req.params.id;
  CartItem.findByPk(id)
    .then(data => {
      res.send({ status: 1, data: data });
    })
    .catch(err => {
      res.send({ status: 0, data: [] });
    });
};


exports.update = (req, res) => {
  const id = req.params.id;

  CartItem.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Product was updated successfully."
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot update Product with id=${id}. Maybe Products was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Error updating Product with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  CartItem.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Product was deleted successfully!"
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Could not delete Product with id=" + id
      });
    });
};

// exports.cartCron = (req,res) =>{
//   const time_limit = config.CART_ITEM_TIME;
//   const sevenDaysFromNow = new Date(new Date().setHours(new Date().getHours() - time_limit));
//     CartItem.destroy({
//       where: {
//         created_at: {
//           [Op.lt]: sevenDaysFromNow
//         }
//       }
//     }).then(records => {
//       if(records == 1) {
//         res.send({
//           status : 1,
//           message: "Cart Items deleted successfully!"
//         });
//       }else{ 
//         res.send({
//           status : 1,
//           message: "No Cart Items deleted!"
//         });
//       }
//     })
// }