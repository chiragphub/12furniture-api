const db = require("../models");
const Product = db.products;
const sharp = require('sharp');
const uuid = require('uuid');
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");
const jwt = require("jsonwebtoken");
const csv = require('csv-parser');
var fs = require('fs');
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
let productImgPath = '.' + process.env.PRODUCT_IMG_UPLOAD_PATH;
let productResizeImgPath = '.' + process.env.PRODUCT_RESIZE_IMG_UPLOAD_PATH;

// Create and Save a new Book
// exports.add = (req, res) => {
//   // Validate request
//   const user_id = req.userId;
//   if (!req.body.name) {
//     res.status(400).send({
//       message: "name can not be empty!"
//     });
//     return;
//   }
//   // Create a product
//   const product = {
//     name: req.body.name,
//     description: req.body.description,
//     // image: req.body.image,
//     price: req.body.price,
//     stock: req.body.stock,
//     status: variantArray.status && variantArray.status
//   };

//   // Save product in database
//   Product.create(product)
//     .then(data => {
//       res.send({ status: 1, data: data ,});
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while creating the Product."
//       });
//     });
// };

exports.add = async (req, res) => {

  //  Create a product
  var filename = '';
  if (req.files.productImage) {

    if (!fs.existsSync(productImgPath)) {
      fs.mkdirSync(productImgPath);
    }
    if (!fs.existsSync(productResizeImgPath)) {
      fs.mkdirSync(productResizeImgPath);
    }
    filename = uuid.v1() + '.jpg';
    req.files.productImage.mv(productImgPath + filename, function (err, result) {
      if (err)
        throw err;
      sharp(productImgPath + filename).resize({ height: 100, width: 100 }).toFile(productResizeImgPath + filename)
        .then(function () {
        })
        .catch(function (err) {
          res.send({
            status: 0,
            message: "image uploaded Fail.!"
          });
        });
    });
  }
  // console.log(req.body.variants)
  Product.create({
    name: req.body.name,
    slug: req.body.productSlug,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    image: filename,
    variant_id: req.body.variants,
    status: req.body.status && req.body.status
  })
    .then(Product => {
      if (Product.dataValues.id) {
        res.send({
          status: 1,
          message: "Product was add successfully."
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot add product value . Maybe product values was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: "Error Cannot add product value"
      });
    });
};

exports.list = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

  var query = 'select p.id,p.slug,p.description,p.image,p.stock,p.price,p.category_id,p.variant_id,p.status,p.created_at,p.updated_at,p.name as product_name from products as p WHERE NOT p.status = -1 GROUP BY id';

  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(async function (rows) {
    var query2 = 'select max(price) as productMaxPrice,min(price) as productMinPrice from products WHERE NOT status = -1';
    await sequelize.query(query2, { type: sequelize.QueryTypes.SELECT }).then(function (productMaxAndMinPrice) {
        res.json({ status: 1, data: rows,productMaxAndMinPrice:productMaxAndMinPrice,total: Object.keys(rows).length });
    }).catch(err => {
      res.json({ status: 1, data: rows, total: Object.keys(rows).length ,t:"t"});
    });
    // rows.count
  }).catch(err => {
    res.send({ status: 0, data: [], query: query });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;

  if ((req.files) && (req.files.productImage)) {
    var filename = uuid.v1() + '.jpg';
    req.files.productImage.mv(productImgPath + filename, function (err, result) {
      if (err)
        throw err;
      sharp(productImgPath + filename).resize({ height: 100, width: 100 }).toFile(productResizeImgPath + filename)
        .then(function () {
        })
        .catch(function (err) {
          res.send({
            status: 0,
            message: "image uploaded Fail.!"
          });
        });
    });
  }
  Product.update({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    image: filename && filename,
    variant_id: req.body.variants,
    status: req.body.status && req.body.status
  }, { where: { id: id } })
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
  Product.update({
    status: -1
  }, { where: { id: id } })
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


exports.productDetails = async (req, res) => {
  const slug = req.body.slug;
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

  // var query = 'select *,categories.id as category_table_id,categories.name as category_name from products as p LEFT JOIN categories ON p.category_id = categories.id WHERE slug="'+slug+'" AND NOT p.status = -1';

  var query = 'select * from products WHERE slug="' + slug + '" AND NOT status = -1';

  // var query = 'select p.*,v.name as variantName,v.id as vId from products as p LEFT JOIN variants as v ON p.variant_id = v.id WHERE slug="'+slug+'" AND NOT p.status = -1';
  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(async function (productsDataArray) {
    var variantIdArray = [];
    var tempObj = {};
    if (productsDataArray.length > 0) {
      variantIdStr = productsDataArray[0].variant_id
      // if(variantIdStr != '' && variantIdStr != null){
      variantIdArray = variantIdStr.split(",")

      await Promise.all(variantIdArray.map(async (variantId) => {
        // tempObj = {}
        var variantQuery = 'select v.id as vId,v.name as vName,v.status as vStatus from variants as v WHERE v.id = "' + variantId + '" AND v.status = 1 GROUP BY v.id'
        await sequelize.query(variantQuery, { type: sequelize.QueryTypes.SELECT }).then(async function (variantList) {
          if (variantList.length > 0) {
            var variantData = variantList[0];
            var variantValuesQuery = 'select vv.id as vvId,vv.value as vvValue,vv.status as vvStatus from variant_values as vv WHERE vv.variant_id = "' + variantData.vId + '" AND vv.status = 1 GROUP BY vv.id'
            await sequelize.query(variantValuesQuery, { type: sequelize.QueryTypes.SELECT }).then(async function (variantValuesList) {
              // console.log(variantValuesList);
              tempObj[variantData.vName] = variantValuesList;
              productsDataArray[0].variantValList = tempObj;
            })
          }
        })
          .catch(err => {
            res.send({ status: 0, message: err, query: variantQuery });
          });
      }))
      res.send({ status: 1, data: productsDataArray, total: Object.keys(productsDataArray).length });
    } else {
      res.json({ status: 1, data: [] });
    }
    // rows.count
  }).catch(err => {
    res.send({ status: 0, data: [], query: "query" });
  });
};


exports.productFilter = async (req, res) => {
  const categoryVal = (req.body.category) ? req.body.category : '';
  const minPriceVal = (req.body.price) ? req.body.price.min : '';
  const maxPriceVal = (req.body.price) ? req.body.price.max : '';
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

  if (minPriceVal != ' ' && maxPriceVal != '' && categoryVal != '') {
    var query = 'select p.id,p.slug,p.description,p.image,p.stock,p.price,p.category_id,p.variant_id,p.status,p.created_at,p.updated_at,p.name as product_name,categories.id as category_table_id,categories.name as category_name from products as p LEFT JOIN categories ON p.category_id = categories.id WHERE p.category_id="' + categoryVal + '" AND p.price BETWEEN "' + minPriceVal + '" AND "' + maxPriceVal + '" AND NOT p.status = -1';
  } else if (categoryVal != '') {
    var query = 'select p.id,p.slug,p.description,p.image,p.stock,p.price,p.category_id,p.variant_id,p.status,p.created_at,p.updated_at,p.name as product_name,categories.id as category_table_id,categories.name as category_name from products as p LEFT JOIN categories ON p.category_id = categories.id WHERE p.category_id="' + categoryVal + '" AND NOT p.status = -1';
  } else if (minPriceVal != ' ' && maxPriceVal != '') {
    var query = 'select p.id,p.slug,p.description,p.image,p.stock,p.price,p.category_id,p.variant_id,p.status,p.created_at,p.updated_at,p.name as product_name,categories.id as category_table_id,categories.name as category_name from products as p LEFT JOIN categories ON p.category_id = categories.id WHERE p.price BETWEEN "' + minPriceVal + '" AND "' + maxPriceVal + '" AND NOT p.status = -1';
  } else {
    var query = 'select p.id,p.slug,p.description,p.image,p.stock,p.price,p.category_id,p.variant_id,p.status,p.created_at,p.updated_at,p.name as product_name,categories.id as category_table_id,categories.name as category_name from products as p LEFT JOIN categories ON p.category_id = categories.id WHERE NOT p.status = -1';
  }

  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
    res.json({ status: 1, data: rows, total: Object.keys(rows).length });
    // rows.count
  }).catch(err => {
    res.send({ status: 0, data: [], query: query });
  });
};