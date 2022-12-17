const db = require("../models");
const category = db.category;
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
    var query = 'select * from categories WHERE NOT status = -1 GROUP BY id';
    await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
        res.json({ status: 1, data: rows, total: Object.keys(rows).length });
        // rows.count
    }).catch(err => {
        res.send({ status: 0, data: [] });
    });
};

exports.add = async (req, res) => {
    // Save Category to database
    category.create({
        name: req.body.category,
        status: req.body.status && req.body.status,
    })
        .then(category => {
            if (category.dataValues.id) {
                res.send({
                    status: 1,
                    message: "Category was add successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot add category value . Maybe category values was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Error Cannot add category value"
            });
        });
};



exports.update = (req, res) => {
    const id = req.params.id;

    category.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Category was updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update category with id=${id}. Maybe category was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Error updating category with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    category.update({
        status: -1
    }, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Category deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot delete category with id=${id}. Maybe category not found!`
                });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Could not delete category with id=" + id
            });
        });
};
