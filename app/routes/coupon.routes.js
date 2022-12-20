const { authJwt } = require("../middlewares");
module.exports = app => {
  const couponController = require("../controllers/coupon.controller.js");

  const router = require("express").Router();
//   router.get("/allorderlist", [authJwt.verifyToken], couponController.allorderlist);

/*********coupon API Section */
// coupon List
router.get("/", couponController.list);
// coupon Add
router.post("/add",[authJwt.verifyToken], couponController.add);
// coupon delete
router.delete("/:id",[authJwt.verifyToken], couponController.delete);
// coupon update
router.put("/:id",[authJwt.verifyToken], couponController.update);
/*********coupon API Section */

  app.use("/api/coupon", router);
};
