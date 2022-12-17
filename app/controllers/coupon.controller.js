const db = require("../models");
const coupon = db.coupon;
const sharp = require('sharp');
const uuid = require('uuid');
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");
const jwt = require("jsonwebtoken");
const { Console } = require("console");
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
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    var query = 'select * from coupons WHERE NOT status = -1 GROUP BY id';
    await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
        res.json({ status: 1, data: rows, total: Object.keys(rows).length });
        // rows.count
    }).catch(err => {
        res.send({ status: 0, data: [] });
    });
};

exports.add = async (req, res) => {
    // Save coupon to database
    coupon.create({
        couponCode: req.body.couponCode,
        numberOfCoupon: req.body.numberOfCoupon,
        discountType: req.body.discountType,
        discountRate: req.body.discountRate,
        abovePrice: req.body.abovePrice,
        status: req.body.status && req.body.status,
        expiryDate: req.body.expiryDate,
    })
        .then(couponAddData => {
            if (couponAddData.dataValues.id) {
                res.send({
                    status: 1,
                    message: "Coupon was add successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot add coupon value . Maybe coupon values was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Error Cannot add coupon value"
            });
        });
};



exports.update = (req, res) => {
    const id = req.params.id;

    coupon.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Coupon was updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update coupon with id=${id}. Maybe coupon was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Error updating coupon with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    coupon.update({
        status: -1
    }, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Coupon deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot delete coupon with id=${id}. Maybe coupon not found!`
                });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Could not delete coupon with id=" + id
            });
        });
};
