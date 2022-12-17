const { authJwt } = require("../middlewares");
module.exports = app => {
  const orderController = require("../controllers/order.controller.js");
  const router = require("express").Router();

/*********ecommerce API Section */
router.post("/detail/save",[authJwt.verifyToken], orderController.detailSave);
// router.post("/products",[authJwt.verifyToken], orderController.userOrderProducts);
router.post("/list",[authJwt.verifyToken], orderController.list);

/*********ecommerce API Section */
router.post("/charge",[authJwt.verifyToken], orderController.charge);

router.post("/checkCoupon",[authJwt.verifyToken], orderController.checkCoupon);
router.post("/userLastAddress", orderController.userLastAddress);
  
  app.use("/api/orders", router);
};
