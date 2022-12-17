const db = require("../models");
const Contact = db.contact;
const nodemailer = require("nodemailer");
const { Sequelize } = require("sequelize");
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
      idle: config.db.pool.idle,
    },
  }
);

async function sendemail(email, subject, text) {
  console.log("sendmail");
  console.log(email);

  let transporter = nodemailer.createTransport({
    host: "mail.palladiumhub.com",
    name: "Ecommerce Createva",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "nikultaka@palladiumhub.com",
      pass: "Testing@123",
    },
  });

  let info = await transporter.sendMail({
    from: '"Nikul Panchal 👻" <nikultaka@palladiumhub.com>',
    to: email,
    subject: subject,
    text: text,
    html: text,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", await nodemailer.getTestMessageUrl(info));
}

exports.add = async (req, res) => {
  //  Create a product
  Contact.create({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    status: req.body.status && req.body.status,
  })
    .then((Contact) => {
      if (Contact.dataValues.id) {
        sendemail(
          req.body.email,
          "Your Feedback is Important to Us",
          "YOUR EMAIL WAS RECIVED SUCCESSFULLY, Our Team Contact You As Soon As Possible"
        );
        sendemail(
          "hardikvadher29@gmail.com",
          "new hello",
          "name : "+req.body.name+",<br>"+
          "email : "+req.body.email+",<br>"+
          "message : "+req.body.message+",<br>"
        );
        res.send({
          status: 1,
          message: "Mail Send Successfully.",
        });
      } else {
        res.send({
          status: 0,
          message: `Oops! Cannot Send Mail!`,
        });
      }
    })
    .catch((err) => {
      res.send({
        status: 0,
        message: "Oops! Cannot Send Mail! Try Again After Some Time!",
      });
    });
};

exports.list = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
  const title = req.query.name;
  var condition_string = "";

  var query = "select * from contacts WHERE NOT status = -1 GROUP BY id";

  await sequelize
    .query(query, { type: sequelize.QueryTypes.SELECT })
    .then(function (rows) {
      res.json({ status: 1, data: rows, total: Object.keys(rows).length });
      // rows.count
    })
    .catch((err) => {
      res.send({ status: 0, data: [] });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Contact.update(
    {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      status: req.body.status && req.body.status,
    },
    { where: { id: id } }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Contact was updated successfully.",
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot update Contact with id=${id}. Maybe Contacts was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.send({
        status: 0,
        message: "Error updating Contact with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Contact.update(
    {
      status: -1,
    },
    { where: { id: id } }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Contact was deleted successfully!",
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot delete Contact with id=${id}. Maybe Contact was not found!`,
        });
      }
    })
    .catch((err) => {
      res.send({
        status: 0,
        message: "Could not delete Contact with id=" + id,
      });
    });
};
