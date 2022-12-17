const db = require("../models");
const Checkout = db.checkouts;
const Item = db.items;
const CartItem = db.cart_items;
const Product = db.products;
const Op = db.Op;
const Role = db.role;
const user = db.user;
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const uuid = require('uuid');
const sharp = require('sharp');
var fs = require('fs');
const { Client, Env, Currency, Models, Tokens } = require('bitpay-sdk');

let tokens = Tokens;
tokens.merchant = config.BITPAY_MERCHANT;
let keyPlainText = config.BITPAY_KEY_TEXT;


let client = new Client(
  null,
  config.BITPAY_MODE,
  keyPlainText,
  tokens
);

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

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
async function sendemail(email, subject, text) {

  let transporter = await nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    name: 'Blazebroker',
    port: process.env.MAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });


  let info = await transporter.sendMail({
    from: '"Nikul Panchal 👻" <' + process.env.MAIL_USERNAME + '>',
    to: email,
    subject: subject,
    text: text,
    html: text,
  });

}
// user management by admin

exports.list = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  var query = 'select * from users WHERE NOT status = -1 AND NOT role_id = 3 GROUP BY id';
  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
    res.json({ status: 1, data: rows, total: Object.keys(rows).length });
    // rows.count
  }).catch(err => {
    res.send({ status: 0, data: [] });
  });
};

exports.add = async (req, res) => {
  // Save Category to database
  user.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 8),
    role_id: 1,
    status: req.body.status && req.body.status,
  })
    .then(user => {
      if (user.dataValues.id) {
        res.send({
          status: 1,
          message: "User was add successfully."
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot add user value . Maybe user values was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Error Cannot add user value"
      });
    });
};




exports.update = (req, res) => {
  const id = req.params.id;

  user.update({
    name: req.body.name && req.body.name,
    // email: req.body.email,
    phone: req.body.phone && req.body.phone,
    password: req.body.password && bcrypt.hashSync(req.body.password, 8),
    status: req.body.status && req.body.status,
  }, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        user.findOne({
          where: {
            id: id,
          }
        })
          .then(userData => {
            Role.findOne({
              where: {
                id: userData.role_id,
              }
            })
              .then(role => {
                res.send({
                  status: 1,
                  id: userData.id,
                  username: userData.username,
                  name: userData.name,
                  email: userData.email,
                  roleName: role.dataValues.name,
                  message: "User was updated successfully."
                });
              })
              .catch(err => {
                res.status(200).send({
                  status: 1,
                  id: userData.id,
                  username: userData.username,
                  name: userData.name,
                  email: userData.email,
                  roleName: '',
                  message: "User was updated successfully."
                });
              });

          })
          .catch(err => {
            res.send({
              status: 1,
              message: "User was updated successfully."
            });
          });
        // console.log(user.name)

      } else {
        res.send({
          status: 0,
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Error updating user with id=" + id
      });
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;
  user.update({
    status: -1
  }, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "User deleted successfully!"
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot delete user with id=${id}. Maybe user not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Could not delete user with id=" + id
      });
    });
};

exports.changePassword = async (req, res) => {
  var oldPassword = req.body.oldPassword;
  user.findOne({
    where: {
      id: req.body.id,
    }
  }).then(user => {
      if (user.dataValues) {
        let userPassword =  user.dataValues.password;   
        let passwordIsValid = bcrypt.compareSync(
          oldPassword,
          userPassword
        );
        if (!passwordIsValid) {
          res.send({
            status: 0,
            message: `The old password you have entered is incorrect!.`
          });
        }
        if (req.body.newPassword == req.body.confirmPassword) {
          user.update({
            password: bcrypt.hashSync(req.body.newPassword, 8),
          }, { where: { id: req.body.id } })
            .then(user => {
              if (user.dataValues) {
                res.send({
                  status: 1,
                  message: `Password has been successfully changed.`
                });
              } else {
                res.send({
                  status: 0,
                  message: `Cannot update user with id=${req.body.id}. Maybe user was not found or req.body is empty!`
                });
              }
            })
        } else {
          res.send({
            status: 0,
            message: `Your new password and confirm password do not match.`
          });
        }
      } else {
        res.send({
          status: 0,
          message: `Cannot find user . Maybe user was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: err.message + " Error Cannot found"
      });
    });
};
