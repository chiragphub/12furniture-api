const db = require("../models");
const order = db.order;
const orderItems = db.orderItem;
const cartItems = db.cart_items;
const Coupon = db.coupon;
const sharp = require('sharp');
const uuid = require('uuid');
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");
const jwt = require("jsonwebtoken");
const { Console } = require("console");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
// const { combineTableNames } = require("sequelize/types/lib/utils");
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
  var userId = (req.body.userId) ? req.body.userId : '';
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  if (userId != '') {
    // var query = 'select o.*,u.name,u.email,u.phone from orders as o LEFT JOIN users as u ON o.user_id = u.id WHERE o.user_id = "' + userId + '" GROUP BY o.id';

    // await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
    //   res.json({ status: 1, data: rows, total: Object.keys(rows).length });
    var finalOrderDataArray1 = []
    var query = 'select o.id as oid,o.user_id as ouser_id,o.appliedTaxPercentage,o.appliedTaxName,o.transaction_id as otransaction_id,o.subtotal as osubtotal,o.tax as otax,o.appliedCouponCode,o.discount as odiscount,o.total as ototal, o.transaction_status as otransaction_status,o.address as oaddress,o.order_notes,o.created_at as ocreated_at,u.name,u.email,u.phone from orders as o LEFT JOIN users as u ON o.user_id = u.id WHERE o.user_id = "' + userId + '" GROUP BY o.id  ORDER BY o.id DESC';
    await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then( async function (orderDataArray) {
      const orderDataArrayMap = orderDataArray.length > 0 &&
      await Promise.all(orderDataArray.map(async (orderVal) => {
          var query2 = 'select * from order_items as oi WHERE oi.order_id = "' + orderVal.oid + '" GROUP BY oi.id'
          await sequelize.query(query2, { type: sequelize.QueryTypes.SELECT }).then(function (orderItemArray) {
            orderVal.orderItemList = orderItemArray
            finalOrderDataArray1.push(orderVal);
          })
        }))
      orderDataArrayMap ?
        res.json({ status: 1, data: finalOrderDataArray1, total: Object.keys(finalOrderDataArray1).length })
        :
        res.json({ status: 1, data: finalOrderDataArray1, total: Object.keys(finalOrderDataArray1).length })
    }).catch(err => {
      res.send({ status: 0, data: [], query: query });
    });
  } else {
    // var query = 'select o.id as oid,o.user_id as ouser_id,o.transaction_id as otransaction_id,o.subtotal as osubtotal,o.tax as otax,o.discount as odiscount,o.total as ototal, o.transaction_status as otransaction_status,o.address as oaddress,o.order_notes,o.created_at as ocreated_at ,oi.*,u.name,u.email,u.phone from orders as o LEFT JOIN users as u ON o.user_id = u.id LEFT JOIN order_items as oi ON o.id = oi.order_id GROUP BY oi.id ';
    var finalOrderDataArray1 = []
    var query = 'select o.id as oid,o.user_id as ouser_id,o.transaction_id as otransaction_id,o.subtotal as osubtotal,o.tax as otax,o.appliedCouponCode,o.discount as odiscount,o.total as ototal, o.transaction_status as otransaction_status,o.address as oaddress,o.order_notes,o.created_at as ocreated_at,u.name,u.email,u.phone from orders as o LEFT JOIN users as u ON o.user_id = u.id GROUP BY o.id  ORDER BY o.id DESC ';
    await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then( async function (orderDataArray) {
      const orderDataArrayMap = orderDataArray.length > 0 &&
      await Promise.all(orderDataArray.map(async (orderVal) => {
          var query2 = 'select * from order_items as oi WHERE oi.order_id = "' + orderVal.oid + '" GROUP BY oi.id'
          await sequelize.query(query2, { type: sequelize.QueryTypes.SELECT }).then(function (orderItemArray) {
            orderVal.orderItemList = orderItemArray
            finalOrderDataArray1.push(orderVal);
          })
        }))
      orderDataArrayMap ?
        res.json({ status: 1, data: finalOrderDataArray1, total: Object.keys(finalOrderDataArray1).length })
        :
        res.json({ status: 1, data: finalOrderDataArray1, total: Object.keys(finalOrderDataArray1).length })
    }).catch(err => {
      res.send({ status: 0, data: [], query: query });
    });
  }


};

// exports.userOrderProducts = async (req, res) => {
//   sequelize
//     .authenticate()
//     .then(() => {
//       console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//       console.error('Unable to connect to the database:', err);
//     });
//   if (req.body.ordetId != '') {
//     // var query = 'select * from orders as o LEFT JOIN order_items as oi ON o.id = oi.order_id LEFT JOIN products as p ON oi.product_id = p.id WHERE o.id = "' + req.body.ordetId + '" GROUP BY oi.id';
//     var query = 'select * from order_items as oi LEFT JOIN orders as o ON oi.order_id = o.id WHERE o.id = "' + req.body.ordetId + '" GROUP BY oi.id';
//   }

//   await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
//     res.json({ status: 1, data: rows, total: Object.keys(rows).length });
//     // rows.count
//   }).catch(err => {
//     res.send({ status: 0, data: [], query: query });
//   });
// };


// exports.detailSave = (req, res) => {
//   let checkOutReqDataArray = req.body;
//   checkOutReqDataArray.map((checkOutReqVal) => {
//     order.create({
//       user_id: checkOutReqVal.user_id,
//       transaction_id: checkOutReqVal.transaction_id,
//       subtotal: checkOutReqVal.subtotal,
//       tax: checkOutReqVal.tax,
//       discount: checkOutReqVal.discount,
//       total: checkOutReqVal.total,
//       transaction_status: checkOutReqVal.transaction_status,
//       address: checkOutReqVal.address,
//       order_notes: checkOutReqVal.order_notes
//     })
//       .then(createdOrderData => {
//         if (createdOrderData.dataValues) {
//           orderItems.create({
//             order_id: createdOrderData.dataValues.id,
//             product_id: checkOutReqVal.product_id,
//             quantity: checkOutReqVal.quantity,
//             price: checkOutReqVal.subtotal,
//             total_price: checkOutReqVal.total,
//           })
//             .then(createdOrderItemsData => {
//               if (createdOrderItemsData.dataValues) {
//                 res.send({
//                   status: 1,
//                   message: "You've successfully placed the order."
//                 });
//               } else {
//                 res.send({
//                   status: 0,
//                   message: `We fetch error to placing order ! Some went wrong please try again.`
//                 });
//               }
//             })
//         } else {
//           res.send({
//             status: 0,
//             message: `We fetch error to placing order ! please try again.`
//           });
//         }
//       })
//       .catch(err => {
//         res.send({
//           status: 0,
//           message: err.message || 'Some error occurred while placing order .'
//         });
//       });
//   })
// };

exports.detailSave = (req, res) => {
  let checkOutReqDataArray = req.body;
  let productsArray = req.body.products;
  let appliedCouponCode = checkOutReqDataArray.couponCode ? checkOutReqDataArray.couponCode : "";

  // checkOutReqDataArray.map((checkOutReqVal) => {
  order.create({
    user_id: checkOutReqDataArray.user_id,
    transaction_id: checkOutReqDataArray.transaction_id,
    subtotal: checkOutReqDataArray.subtotal,
    appliedTaxName: checkOutReqDataArray.appliedTaxName,
    appliedTaxPercentage: checkOutReqDataArray.appliedTaxPer,
    tax: checkOutReqDataArray.tax,
    discount: checkOutReqDataArray.discount,
    appliedCouponCode: appliedCouponCode,
    total: checkOutReqDataArray.total,
    transaction_status: checkOutReqDataArray.transaction_status,
    address: checkOutReqDataArray.address,
    addressArray: checkOutReqDataArray.addressArray,
    order_notes: checkOutReqDataArray.order_notes
  })
    .then(createdOrderData => {
      if (createdOrderData.dataValues) {
        productsArray.map((product) => {
          orderItems.create({
            order_id: createdOrderData.dataValues.id,
            product_id: product.id,
            quantity: product.cart_qty,
            product_name: product.name,
            product_image: product.image,
            product_price: product.price,
            variantData:product.variantData,
            total_price: (product.price * product.cart_qty),
          })
            .then(createdOrderItemsData => {
              if (createdOrderItemsData.dataValues) {
                cartItems.destroy({
                  where: { session_id: checkOutReqDataArray.uniqueSessionId }
                })
                  .then(num => {
                    if(num != 0){
                      if(appliedCouponCode != ''){
                        Coupon.findOne({
                          where: {
                            couponCode: appliedCouponCode,
                          }
                        }).then(couponData => {
                          Coupon.update({
                            numberOfCoupon:(couponData.numberOfCoupon - 1)
                          }, { where: { couponCode: appliedCouponCode } })
                            .then(couponUpdate => {
                              res.send({
                                status: 1,
                                message: "You've successfully placed the order."
                              });
                            })
                            .catch(err => {
                              res.status(500).send({ message: err.message || "Coupon Data not update"});
                            });
                        })
                        .catch(err => {
                          res.status(500).send({ message: err.message || "Coupon Data not found"});
                        });
                      } else {
                        res.send({
                          status: 1,
                          message: "You've successfully placed the order."
                        });
                      }
                    } 
                  })
                  .catch(err => {
                    res.send({
                      status: 0,
                      message: err.message || 'cart Items not delete Some error occurred   .'
                    });
                  });
              } else {
                res.send({
                  status: 0,
                  message: `We fetch error to placing order ! Something went wrong please try again.`
                });
              }
              // })
            })
        })
      } else {
        res.send({
          status: 0,
          message: `We fetch error to placing order ! please try again.`
        });
      }
    })
    .catch(err => {
      res.send({
        status: 0,
        message: err.message || 'Some error occurred while placing order .'
      });
    });
  // })
};


exports.charge = async (req, res) => {
  const { amount, email, phone, name, state, city, line1 } = req.body;
  const {
    cardNumber,
    cardExpMonth,
    cardExpYear,
    cardCVC,
    country,
    postalCode,
  } = req.body;
  if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
    // return 
    res.send({
      status: 0,
      message: "Necessary Card Details are required for One Time Payment"
    });
  }
  try {
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCVC,
        address_state: state,
        address_city: city,
        address_country: country,
        address_zip: postalCode,
        address_line1: line1,
        name: name,
        // email:email
      },
    });

    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: "INR",
      source: cardToken.id,
      receipt_email: email,
    });

    if (charge.status === "succeeded") {
      return res.send({
        status: 1,
        data: charge,
        message: 'payment successfully.'
      });
    } else {
      return res.send({
        status: 0,
        message: 'Some error occurred while do payment .'
      });
    }
  } catch (error) {
    return res.send({
      status: 0,
      message: error.raw.message || 'Some error occurred while placing order .'
    });
  }
};


exports.checkCoupon = (req, res) => {
  if (!req.body.couponCode) {
    return res.send({
      status: 0,
      message: 'Please provide coupon code.'
    });
  }
  Coupon.findOne({
    where: {
      couponCode: req.body.couponCode,
    }
  })
    .then(couponData => {
      if (!couponData || couponData.status != 1) {
        return res.send({
          status: 0,
          message: 'Provided coupon code is invalid.'
        });
      }
      if (couponData.numberOfCoupon <= 0) {
        return res.send({
          status: 0,
          message: 'Provided coupon code is not available.'
        });
      }
      var expiryDate = couponData.expiryDate;
      if(expiryDate >= new Date()){
        order.findAll({
          where: {
            user_id: req.body.userId,
            appliedCouponCode: req.body.couponCode,
            
          }
        }).then(orderData => {
          if(orderData.length > 0){
            return res.send({
              status: 0,
              message: 'This coupon already used by this user.'
            });
          }
          return res.send({
            status: 1,
            id: couponData.id,
            couponCode: couponData.couponCode,
            numberOfCoupon: couponData.numberOfCoupon,
            discountType: couponData.discountType,
            discountRate: couponData.discountRate,
            abovePrice: couponData.abovePrice,
            expiryDate: couponData.expiryDate,
            status: couponData.status,
          });
        }).catch(err => {
          res.status(500).send({ message: err.message });
        });
      } else {
        return res.send({
          status: 0,
          message: 'Provided coupon code is expired.'
        });
      }
         
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.userLastAddress = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

  var query = 'select addressArray,user_id,id from orders WHERE user_id = '+ req.body.userId +' GROUP BY id ORDER BY id DESC limit 0,1'; 

  await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(async function (addressData) {
        if(addressData && addressData[0].addressArray != ''){
          res.json({ status: 1, data: addressData[0].addressArray});
        } else {
          res.json({ status: 1, data: []});
        }   
  }).catch(err => {
    res.send({ status: 0, data: [], query: query });
  });
};