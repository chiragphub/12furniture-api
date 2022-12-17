const db = require("../models");
const subCategory = db.subcategory;
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
    var query = 'select * from subcategories where Not status = -1 AND category_id = ' + req.body.category_id + ' GROUP BY id';
    var categoriesQuery = 'select id,name from categories where id = ' + req.body.category_id;
    // var query = 'select sc.id,sc.category_id,sc.name,sc.status,sc.created_at,sc.updated_at,c.name as category_name from subcategories as sc left join categories as c on sc.category_id = c.id WHERE NOT sc.status = -1 AND category_id = '+req.body.category_id+' GROUP BY id';

    await sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (rows) {
        sequelize.query(categoriesQuery, { type: sequelize.QueryTypes.SELECT }).then(function (categoryName) {
            res.json({ status: 1, data: rows, categoryData:categoryName, total: Object.keys(rows).length });
        }).catch(err => {
            res.json({ status: 1, data: rows, total: Object.keys(rows).length });
        });
        // rows.count
    }).catch(err => {
        res.send({ status: 0, data: [] });
    });
};

exports.add = async (req, res) => {
    // Save sub Category to database
    subCategory.create({
        category_id: req.body.category_id,
        name: req.body.subcategory,
        status: req.body.status && req.body.status,
    })
        .then(subCategory => {
            if (subCategory.dataValues.id) {
                res.send({
                    status: 1,
                    message: "Sub category was add successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot add sub category value . Maybe sub category values was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Error Cannot add Sub category value"
            });
        });
};



exports.update = (req, res) => {
    const id = req.params.id;

    subCategory.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Sub category was updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update sub category with id=${id}. Maybe sub category was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Error updating sub category with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    subCategory.update({
        status: -1
    }, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Sub category deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot delete sub category with id=${id}. Maybe sub category not found!`
                });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Could not delete sub category with id=" + id
            });
        });
};
