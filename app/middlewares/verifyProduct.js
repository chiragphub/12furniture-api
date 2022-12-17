const db = require("../models");
const Product = db.products;

checkDuplicateSlug = (req, res, next) => {
    // Slug check

    Product.findOne({
      where: {
        slug: req.body.productSlug,
        // status: 1
      }
    }).then(Product => {
      if (Product) {
        res.status(200).send({
          status : 0,
          message: "Failed! Slug is already exists!"
        });
        return;
      }
      next();
    });
};



const verifyProduct = {
  checkDuplicateSlug: checkDuplicateSlug,
};

module.exports = verifyProduct;
