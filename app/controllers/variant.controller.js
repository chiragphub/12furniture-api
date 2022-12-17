const db = require("../models");
const variant = db.variant;
const variantValue = db.variant_value;
const sharp = require('sharp');
const uuid = require('uuid');
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");
const jwt = require("jsonwebtoken");
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
      idle: config.db.pool.idle
    }
  }
);

exports.list = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  var query = 'select * from variants WHERE NOT status = -1 GROUP BY id';
  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
    res.json({ status: 1, data: rows, total: Object.keys(rows).length });
    // rows.count
  }).catch(err => {
    res.send({ status: 0, data: [] });
  });
};

exports.listForProdctForm = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  var query = 'select v.id as value,v.name as label from variants as v WHERE v.status = 1 GROUP BY v.id';
  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
    res.json({ status: 1, data: rows, total: Object.keys(rows).length });
    // rows.count
  }).catch(err => {
    res.send({ status: 0, data: [] ,query:query});
  });
};

exports.add = async (req, res) => {
  // Save user to database
  var variantArray = req.body.varient;
  variant.create({
    name: variantArray.name,
    status: variantArray.status && variantArray.status
  })
    .then(variant => {
      if (variant.dataValues.id) {
        var lastVariantInsertId = variant.dataValues.id;
        var variantValueArray = variantArray.value;
        variantValueArray.forEach(variantVal => {

          variantValue.create({
            value: variantVal.variantvalue,
            variant_id: lastVariantInsertId,
            status: 1,
          });
        });
        res.send({
          status: 1,
          message: "Variant was add successfully."
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot add variant value . Maybe variant values was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Error Cannot add variant value"
      });
    });
};



exports.update = (req, res) => {
  const id = req.params.id;

  variant.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Variant was updated successfully."
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot update variant with id=${id}. Maybe variants was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Error updating variant with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  variantValue.update({
    status: -1
  }, { where: { variant_id: id } })
  variant.update({
    status: -1
  }, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Variant deleted successfully!"
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot delete Variant with id=${id}. Maybe variant not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Could not delete Variant with id=" + id
      });
    });
};

// Variant Value fun 
exports.deleteVariantValue = (req, res) => {
  const id = req.params.id;
  const variant_id = req.params.variant_id;
  variantValue.update({
    status: -1
  }, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Variant value deleted successfully!"
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot delete Variant value with id=${id}. Maybe variant value not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Could not delete Variant value with id=" + id
      });
    });
};


exports.updateVariantValue = (req, res) => {
  const id = req.params.id;
  variantValue.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Variant value was updated successfully."
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot update variant value with id=${id}. Maybe variant values was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Error updating variant value with id=" + id
      });
    });
};


exports.addVariantValue = (req, res) => {
  const id = req.body.variant_id;
  variantValue.create({
    variant_id: id,
    value: req.body.value,
    status: 1,
  })
    .then(variant_value => {
      if (variant_value) {
        res.send({
          status: 1,
          message: "Variant value was add successfully."
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot add variant value with id=${id}. Maybe variant values was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Error updating variant value with id=" + id
      });
    });
};

exports.listVariantValue = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  // var query = 'select vv.id,vv.variant_id,vv.value,vv.status,vv.created_at,vv.updated_at,v.name as variant_name from variant_values as vv left join variants as v on vv.variant_id = v.id WHERE NOT vv.status = -1 AND variant_id = ' + req.body.id + ' GROUP BY id';
  var query = 'select * from variant_values where Not status = -1 AND variant_id = ' + req.body.id + ' GROUP BY id';
  var variantSql = 'select id,name from variants where id = ' + req.body.id;

  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
    sequelize.query(variantSql, { type: sequelize.QueryTypes.SELECT }).then(function (variantdata) {
      res.json({ status: 1, data: rows, variantData: variantdata, total: Object.keys(rows).length });
    }).catch(err => {
      res.json({ status: 1, data: rows, total: Object.keys(rows).length });
    });
    // rows.count
  }).catch(err => {
    res.send({ status: 0, data: [], query: query });
  });
};

exports.allVariantAndValueList = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  // var query = 'select vv.id as vvId ,vv.variant_id as variant_id,vv.value as vvValue ,vv.status as vvStatus,v.status as vStatus,v.id as vid,v.name as variant_name from variants as v left join variant_values as vv on v.id = vv.variant_id  WHERE NOT v.status = -1';
  var query = 'select vv.id as vvId ,vv.variant_id as variant_id,vv.value as vvValue ,vv.status as vvStatus,v.status as vStatus,v.id as vid,v.name as variant_name from variants as v left join variant_values as vv on v.id = vv.variant_id  WHERE v.status = 1';

  // var variantIdList = 'select id,name from variants where Not status = -1 GROUP BY id';
  var variantIdList = 'select id,name from variants WHERE status = 1 GROUP BY id';

  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
    sequelize.query(variantIdList, { type: sequelize.QueryTypes.SELECT }).then(function (variantIdArray) {
      if (Object.keys(variantIdArray).length > 0) {
        var temp = {};
        var dataArray = {};
        variantIdArray.forEach(variantIdVal => {
          var variantIdValName = variantIdVal.name;
          temp = {};  
          rows.forEach(allData => {        
            // console.log(variantIdVal.id)
              if (allData.vid == variantIdVal.id) {
                temp[variantIdValName+'_'+allData.vvId] = allData
              }
          })
          dataArray[variantIdValName] = temp;
        })
        
      }
      res.json({ status: 1, data: dataArray, total: Object.keys(variantIdArray).length });


    }).catch(err => {
      res.send({ status: 0, data: [], query: variantIdList });
    });
  }).catch(err => {
    res.send({ status: 0, data: [], query: query });
  });
};
