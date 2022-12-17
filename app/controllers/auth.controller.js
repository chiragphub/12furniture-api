const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const User = db.user;
const GoogleUser = db.googleUser;
const Role = db.role;
const Op = db.Op;
const sharp = require('sharp');
const uuid = require('uuid');
const nodemailer = require("nodemailer");
const { Sequelize } = require("sequelize");


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


async function sendemail(email, subject, text) {
  console.log("sendmail");
  console.log(process.env.MAIL_HOST);
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
    from: '"Mohit 👻" <' + process.env.MAIL_USERNAME + '>',
    to: email,
    subject: subject,
    text: text,
    html: text
  });
  console.log("Message sent: %s", info.messageId);
  console.log("username: %s", process.env.MAIL_USERNAME);
  console.log("Preview URL: %s", email);
}

exports.signup = async (req, res) => {
  // Save user to database
  User.create({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.contact,
    status: 1,
    role_id: 1,
    // title: req.body.title,
    // zip: req.body.zip,
    // company_name: req.body.company_name,
    // document: req.body.document,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            //sendemail(req.body.email, "Welcome Ecommerce Createva", "You have successfully registered");
            res.send({ status: 1, message: "User was registered successfully!" });
          });
        });
      } else {
        // User role 1
        user.setRoles([1]).then(() => {
          //sendemail(req.body.email, "Welcome Ecommerce Createva", "You have successfully registered");
          res.send({ status: 1, message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {

  if (!req.body.email) {
    return res.status(201).send({ status: 0, message: "email is required." });
  }
  if (!req.body.password) {
    return res.status(201).send({ status: 0, message: "password is required." });
  }
  User.findOne({
    where: {
      email: req.body.email,
    }
  })
    .then(user => {
      if (!user) {
        return res.status(201).send({ status: 0, message: "Account Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(201).send({
          status: 0,
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      if (user.status != 1) {
        return res.status(201).send({
          status: 0,
          accessToken: null,
          message: "User not active!"
        });
      }

      let authorities = [];

      user.getRoles().then(roles => {
        console.log("roles===========>", roles)
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        // console.log("authorities------------------------>",authorities)
        let token = jwt.sign({ id: user.id, roles: authorities[0] }, config.auth.secret, {
          expiresIn: 864000 // 24 hours
        });
        Role.findOne({
          where: {
            id: user.role_id,
          }
        })
          .then(role => {
            res.status(200).send({
              status: 1,
              id: user.id,
              username: user.username,
              name: user.name,
              email: user.email,
              phone: user.phone,
              roles: authorities[0],
              roleName: role.dataValues.name,
              accessToken: token
            });
          })
          .catch(err => {
            res.status(200).send({
              status: 1,
              id: user.id,
              username: user.username,
              name: user.name,
              phone: user.phone,
              email: user.email,
              roles: authorities[0],
              roleName: '',
              accessToken: token
            });
          });

      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.signinGoogle = (req, res) => {

  const email = req.body.email;
  User.findOne({
    where: {
      email: email
    }
  }).then(userFind => {
    if (userFind) {
      let token = jwt.sign({ id: userFind.dataValues.id, roles: '' }, config.auth.secret, {
        expiresIn: 864000 // 24 hours
      });
      res.status(200).send({
        status: 1,
        id: userFind.dataValues.id,
        username: userFind.dataValues.username,
        name: userFind.dataValues.name,
        phone: userFind.dataValues.phone,
        email: userFind.dataValues.email,
        roles: "",
        roleName: 'user',
        accessToken: token
      });


    } else {

      // Save user to database
      GoogleUser.create({
        email: req.body.email ?? '',
        name: req.body.name ?? '',
        phone: req.body.contact ?? 123456789,
        status: 1,
        role_id: 1,
        // title: req.body.title,
        // zip: req.body.zip,
        // company_name: req.body.company_name,
        // document: req.body.document,
        password: req.body.password ? bcrypt.hashSync(req.body.password, 8) : bcrypt.hashSync("123456", 8)
      })
        .then(googleUser => {
          User.create({
            email: req.body.email ?? '',
            name: req.body.name ?? '',
            phone: req.body.contact ?? 123456789,
            status: 1,
            role_id: 1,
            password: req.body.password ? bcrypt.hashSync(req.body.password, 8) : bcrypt.hashSync("123456", 8)
          })
            .then(user => {
              let token = jwt.sign({ id: user.dataValues.id, roles: '' }, config.auth.secret, {
                expiresIn: 864000 // 24 hours
              });
              res.status(200).send({
                status: 1,
                id: user.dataValues.id,
                username: user.dataValues.username,
                name: user.dataValues.name,
                phone: user.dataValues.phone,
                email: user.dataValues.email,
                roles: "",
                roleName: 'user',
                accessToken: token
              });


            })
            .catch(err => {
              res.status(500).send({ message: err.message });
            });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
    }
  });





}


exports.resetpassword = (req, res) => {

  console.log(req.body);
  const userID = req.userId;
  User.update({
    password: bcrypt.hashSync(req.body.password, 8)
  }, { where: { id: userID } })
    .then(user => {
      if (user) {
        res.send({ status: 1, message: "password reset successfully!" });
      } else {
        res.send({ status: 0, message: "User not found" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetpasswordfrontend = (req, res) => {

  console.log(req.body);
  const email = req.body.email;
  User.update({
    password: bcrypt.hashSync(req.body.password, 8)
  }, { where: { email: email } })
    .then(user => {
      if (user) {
        res.send({ status: 1, message: "password reset successfully!" });
      } else {
        res.send({ status: 0, message: "User not found" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};



exports.basicupdate = (req, res) => {

  console.log(req.body);
  const userID = req.userId;
  User.update({
    name: req.body.name,
    contact: req.body.contact,
    shop_name: req.body.shop_name,
    phone: req.body.phone,
    address: req.body.address,
    province: req.body.province,
    city: req.body.city,
    area: req.body.area,
  }, { where: { id: userID } })
    .then(user => {
      res.send({ status: 1, message: "basic information updated successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.user = (req, res) => {
  const id = req.userId;


  User.findByPk(id)
    .then(data => {
      res.send({ status: 1, data: data });
    })
    .catch(err => {
      res.send({ status: 0, data: [] });
    });
}
exports.uploaddocument = (req, res) => {

  const email = req.body.email;
  let filename = req.files.signupdocument.name;
  filename = filename.split(" ").join("_");
  req.files.signupdocument.mv('./uploads/' + filename, function (err, result) {
    if (err)
      throw err;
    User.update({
      document: filename
    }, { where: { email: email } })
    res.send({
      status: 1,
      success: true,
      message: "document uploaded successfully!"
    });
  });

};

exports.profile_image = (req, res) => {

  const userID = req.userId;

  var filename = uuid.v1() + '.jpg';

  req.files.profileimage.mv('./uploads/profile/' + filename, function (err, result) {
    if (err)
      throw err;

    sharp('./uploads/profile/' + filename).resize({ height: 100, width: 100 }).toFile('./uploads/profile/resize/' + filename)
      .then(function (newFileInfo) {
        User.update({
          image: filename
        }, { where: { id: userID } })
        res.send({
          status: 1,
          message: "image uploaded successfully!",
          file_name: filename
        });

      })
      .catch(function (err) {
        res.send({
          status: 0,
          message: "image uploaded Fail.!"
        });

      });

  });

};


exports.forgotpassword = (req, res) => {
  const email = req.body.email;
  User.findOne({
    where: {
      email: email
    }
  }).then(user => {
    if (user) {
      const encodedEmail = Buffer.from(email).toString('base64');
      sendemail(req.body.email, "Forgot Password - Blazebroker", "Please click <a href='" + config.SITE_URL + "/change-password/?id=" + encodedEmail + "'>here</a> to reset password");
      res.send({ status: 1, message: "Reset password link sent successfully!" });
    } else {
      res.send({ status: 0, message: "Email not found" });
    }
  });
};

exports.userlist = async (req, res) => {

  var query = 'select u.id,u.username,u.email,u.name,u.contact,u.title,u.company_name,u.zip,u.document,u.phone,u.address,u.province,u.city,u.area,u.shop_name,u.status,u.created_at,u.updated_at from  users  as u left join user_roles as ur on u.id = ur.user_id where ur.role_id = 1';

  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
    res.json({ status: 1, data: rows });
  }).catch(err => {
    res.send({ status: 0, data: [] });
  });

};

exports.sellerupdate = (req, res) => {
  const usertoken = req.headers["x-access-token"] || req.headers["Authorization"];
  const decoded = jwt.verify(usertoken, config.auth.secret);
  if (decoded.roles != config.role.admin) {
    res.send({
      status: 0,
      message: 'You haven`t permission to access.!'
    });
  }
  const userID = req.body.id;
  User.update({
    name: req.body.name,
    contact: req.body.contact,
    shop_name: req.body.shop_name,
    phone: req.body.phone,
    address: req.body.address,
    province: req.body.province,
    city: req.body.city,
    area: req.body.area,
  }, { where: { id: userID } })
    .then(user => {
      res.send({ status: 1, message: "Basic information updated successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.delete = (req, res) => {
  const usertoken = req.headers["x-access-token"] || req.headers["Authorization"];
  const decoded = jwt.verify(usertoken, config.auth.secret);
  if (decoded.roles != config.role.admin) {
    res.send({
      status: 0,
      message: 'You haven`t permission to access.!'
    });
  }
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Seller was deleted successfully!"
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot delete Seller with id=${id}. Maybe Seller was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Could not delete Seller with id=" + id
      });
    });
};

exports.changestatus = (req, res) => {
  const usertoken = req.headers["x-access-token"] || req.headers["Authorization"];
  const decoded = jwt.verify(usertoken, config.auth.secret);
  if (decoded.roles != config.role.admin) {
    res.send({
      status: 0,
      message: 'You haven`t permission to access.!'
    });
  }
  const userID = req.body.id;
  User.update({
    status: req.body.status,
  }, { where: { id: userID } })
    .then(user => {
      res.send({ status: 1, message: "Status updated successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.changepassword = (req, res) => {
  const usertoken = req.headers["x-access-token"] || req.headers["Authorization"];
  const decoded = jwt.verify(usertoken, config.auth.secret);
  if (decoded.roles != config.role.admin) {
    res.send({
      status: 0,
      message: 'You haven`t permission to access.!'
    });
  }

  const userID = req.body.id;

  User.update({
    password: bcrypt.hashSync(req.body.password, 8)
  }, { where: { id: userID } })
    .then(user => {
      if (user) {
        res.send({ status: 1, message: "password reset successfully!" });
      } else {
        res.send({ status: 0, message: "User not found" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
