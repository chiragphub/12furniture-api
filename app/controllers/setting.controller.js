const db = require("../models");
const Setting = db.setting;
const sharp = require("sharp");
const uuid = require("uuid");
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");
const jwt = require("jsonwebtoken");
const csv = require("csv-parser");
var fs = require("fs");
const { Console } = require("console");
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
/* 1 *************************************************************************************************************************************************/
let settingImgPath = '.' + process.env.SETTING_IMG_UPLOAD_PATH;

exports.saveHeaderLogo = async (req, res) => {
  //  Create a HeaderLogo

  var filename = "";
  if (req.files.headerLogo) {
    if (!fs.existsSync(settingImgPath)) {
      fs.mkdirSync(settingImgPath);
    }
    filename = "headerLogo.jpg";
    req.files.headerLogo.mv(
      settingImgPath + filename,
      function (err, result) {
        if (err) throw err;
      }
    );
  }
  Setting.findOne({
    where: {
      name: "headerLogo",
    },
  }).then((setting) => {
    if (!setting) {
      Setting.create({
        name: "headerLogo",
        value: filename,
        status: req.body.status && req.body.status,
      })
        .then((setting) => {
          if (setting.dataValues.id) {
            res.send({
              status: 1,
              message: "HeaderLogo was save successfully.",
            });
          } else {
            res.send({
              status: 0,
              message: `Cannot save HeaderLogo . Maybe HeaderLogo was not found or value is empty!`,
            });
          }
        })
        .catch((err) => {
          res.send({
            status: 0,
            message: "Error Cannot save HeaderLogo",
          });
        });
    } else {
      Setting.update(
        {
          name: "headerLogo",
          value: filename,
          status: req.body.status && req.body.status,
        },
        { where: { id: setting.id } }
      )
        .then((num) => {
          if (num == 1) {
            res.send({
              status: 1,
              message: "HeaderLogo was updated successfully.",
            });
          } else {
            res.send({
              status: 0,
              message: `Cannot update HeaderLogo with id=${id}. Maybe HeaderLogo was not found or value is empty!`,
            });
          }
        })
        .catch((err) => {
          res.send({
            status: 0,
            message: "Error updating HeaderLogo with id=" + id,
          });
        });
    }
  });
};

/** 2 ************************************************************************************************************************************************/

exports.saveFooterLogo = async (req, res) => {
  //  Create a footerLogo

  var filename = "";
  var settingImgPath = '.' + process.env.SETTING_IMG_UPLOAD_PATH;
  if (!fs.existsSync(settingImgPath)) {
    fs.mkdirSync(settingImgPath);
  }
  if (req.files.footerLogo) {
    filename = "footerLogo.jpg";
    req.files.footerLogo.mv(
      settingImgPath + filename,
      function (err, result) {
        if (err) throw err;
      }
    );
  }
  Setting.findOne({
    where: {
      name: "footerLogo",
    },
  }).then((setting) => {
    if (!setting) {
      Setting.create({
        name: "footerLogo",
        value: filename,
        status: req.body.status && req.body.status,
      })
        .then((setting) => {
          if (setting.dataValues.id) {
            res.send({
              status: 1,
              message: "FooterLogo was save successfully.",
            });
          } else {
            res.send({
              status: 0,
              message: `Cannot save FooterLogo . Maybe FooterLogo was not found or value is empty!`,
            });
          }
        })
        .catch((err) => {
          res.send({
            status: 0,
            message: "Error Cannot save FooterLogo",
          });
        });
    } else {
      Setting.update(
        {
          name: "footerLogo",
          value: filename,
          status: req.body.status && req.body.status,
        },
        { where: { id: setting.id } }
      )
        .then((num) => {
          if (num == 1) {
            res.send({
              status: 1,
              message: "FooterLogo was updated successfully.",
            });
          } else {
            res.send({
              status: 0,
              message: `Cannot update FooterLogo with id=${id}. Maybe FooterLogo was not found or value is empty!`,
            });
          }
        })
        .catch((err) => {
          res.send({
            status: 0,
            message: "Error updating FooterLogo with id=" + id,
          });
        });
    }
  });
};

/*** 3 ***********************************************************************************************************************************************/

exports.saveContactInformation = async (req, res) => {
  //  Create a Address

  var addressarr = req.body;
  var addressname = Object.keys(addressarr);

  addressname.forEach((key) => {
    Setting.findOne({
      where: {
        name: key,
      },
    }).then((setting) => {
      // return  false
      if (setting) {
        Setting.update(
          {
            name: key,
            value: addressarr[key],
            status: req.body.status && req.body.status,
          },
          { where: { id: setting.dataValues.id } }
        )
          .then((num) => {
            if (num == 1) {
              res.send({
                status: 1,
                message: "Contact Information was updated successfully.",
              });
            } else {
              res.send({
                status: 0,
                message: `Cannot update Contact Information with id=${id}. Maybe Contact Information was not found or value is empty!`,
              });
            }
          })
          .catch((err) => {
            res.send({
              status: 0,
              message: "Error updating Contact Information with id=" + id,
            });
          });
      } else {
        Setting.create({
          name: key,
          value: addressarr[key],
          status: req.body.status && req.body.status,
        })
          .then((setting) => {
            if (setting.dataValues.id) {
              res.send({
                status: 1,
                message: "Contact Information was save successfully.",
              });
            } else {
              res.send({
                status: 0,
                message: `Cannot save Contact Information . Maybe Contact Information was not found or value is empty!`,
              });
            }
          })
          .catch((err) => {
            res.send({
              status: 0,
              message: "Error Cannot save Contact Information",
            });
          });
      }
    });
  });
};

/**** 4 **********************************************************************************************************************************************/

exports.addSocialMedia = async (req, res) => {
  //  Create a Address

  var socialarr = req.body;
  var socialmedianame = Object.keys(socialarr);

  socialmedianame.forEach((key) => {
    Setting.findOne({
      where: {
        name: key,
      },
    }).then((setting) => {
      // return  false
      if (setting) {
        Setting.update(
          {
            name: key,
            value: socialarr[key],
            status: req.body.status && req.body.status,
          },
          { where: { id: setting.dataValues.id } }
        )
          .then((num) => {
            if (num == 1) {
              res.send({
                status: 1,
                message: "Social-Media Accounts was updated successfully.",
              });
            } else {
              res.send({
                status: 0,
                message: `Cannot update Social-Media Accounts with id=${id}. Maybe Social-Media Accounts was not found or value is empty!`,
              });
            }
          })
          .catch((err) => {
            res.send({
              status: 0,
              message: "Error updating Social-Media Accounts with id=" + id,
            });
          });
      } else {
        Setting.create({
          name: key,
          value: socialarr[key],
          status: req.body.status && req.body.status,
        })
          .then((setting) => {
            if (setting.dataValues.id) {
              res.send({
                status: 1,
                message: "Social-Media Accounts was save successfully.",
              });
            } else {
              res.send({
                status: 0,
                message: `Cannot save Social-Media Accounts . Maybe Social-Media Accounts was not found or value is empty!`,
              });
            }
          })
          .catch((err) => {
            res.send({
              status: 0,
              message: "Error Cannot save Social-Media Accounts",
            });
          });
      }
    });
  });
};


exports.addPayment = async (req, res) => {
  //  Create a Address
  var paymentReqBodyObj = req.body;
  var paymentReqBodyObjKey = Object.keys(paymentReqBodyObj);

  paymentReqBodyObjKey.forEach((key) => {
    Setting.findOne({
      where: {
        name: key,
      },
    }).then((setting) => {
      // return  false
      if (setting) {
        Setting.update(
          {
            name: key,
            value: paymentReqBodyObj[key],
            status: req.body.status && req.body.status,
          },
          { where: { id: setting.dataValues.id } }
        )
          .then((num) => {
            if (num == 1) {
              res.send({
                status: 1,
                message: "Payment setting was updated successfully.",
              });
            } else {
              res.send({
                status: 0,
                message: `Cannot update Payment setting with id=${id}. Maybe Payment setting was not found or value is empty!`,
              });
            }
          })
          .catch((err) => {
            res.send({
              status: 0,
              message: "Error updating Payment setting with id=" + id,
            });
          });
      } else {
        Setting.create({
          name: key,
          value: paymentReqBodyObj[key],
          status: req.body.status && req.body.status,
        })
          .then((setting) => {
            if (setting.dataValues.id) {
              res.send({
                status: 1,
                message: "Payment setting was save successfully.",
              });
            } else {
              res.send({
                status: 0,
                message: `Cannot save Payment setting . Maybe Payment setting was not found or value is empty!`,
              });
            }
          })
          .catch((err) => {
            res.send({
              status: 0,
              message: "Error Cannot save Payment setting",
            });
          });
      }
    });
  });
};

exports.addGeneral = async (req, res) => {
  //  Create a Address
  var generalReqBodyObj = req.body;
  var generalReqBodyObjKey = Object.keys(generalReqBodyObj);

  generalReqBodyObjKey.forEach((key) => {
    Setting.findOne({
      where: {
        name: key,
      },
    }).then((setting) => {
      // return  false
      if (setting) {
        Setting.update(
          {
            name: key,
            value: generalReqBodyObj[key],
            status: req.body.status && req.body.status,
          },
          { where: { id: setting.dataValues.id } }
        )
          .then((num) => {
            if (num == 1) {
              res.send({
                status: 1,
                message: "General setting was updated successfully.",
              });
            } else {
              res.send({
                status: 0,
                message: `Cannot update General setting with id=${id}. Maybe general setting was not found or value is empty!`,
              });
            }
          })
          .catch((err) => {
            res.send({
              status: 0,
              message: "Error updating General setting with id=" + id,
            });
          });
      } else {
        Setting.create({
          name: key,
          value: generalReqBodyObj[key],
          status: req.body.status && req.body.status,
        })
          .then((setting) => {
            if (setting.dataValues.id) {
              res.send({
                status: 1,
                message: "General setting was save successfully.",
              });
            } else {
              res.send({
                status: 0,
                message: `Cannot save general setting . Maybe general setting was not found or value is empty!`,
              });
            }
          })
          .catch((err) => {
            res.send({
              status: 0,
              message: "Error Cannot save general setting",
            });
          });
      }
    });
  });
};

/***** 5 *********************************************************************************************************************************************/


exports.getSettingValueByName = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
  var query = 'SELECT value FROM settings WHERE name = "' + req.body.name + '"';

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


exports.list = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
  var query = 'SELECT * FROM settings WHERE status = 1 GROUP BY id';

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


exports.nameValueList = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
  var query = 'SELECT name,value FROM settings WHERE status = 1 GROUP BY id';

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

/**************************************************************************************************************************************************/