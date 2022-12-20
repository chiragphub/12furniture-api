const { authJwt } = require("../middlewares");
const { verifyProduct } = require("../middlewares");
module.exports = app => {
  const productController = require("../controllers/product.controller.js");

  const router = require("express").Router();



/*********ecommerce API Section */
router.get("/", productController.list); //,[authJwt.verifyToken]
router.delete("/:id",[authJwt.verifyToken], productController.delete);
router.put("/:id",[authJwt.verifyToken], productController.update);
router.post("/add",[authJwt.verifyToken],[verifyProduct.checkDuplicateSlug], productController.add);
router.post("/details", productController.productDetails);
// product Filter
router.post("/filter",productController.productFilter);

/*********ecommerce API Section */
  
  app.use("/api/products", router);
};
