const { authJwt } = require("../middlewares");
module.exports = app => {
  const variantController = require("../controllers/variant.controller.js");

  const router = require("express").Router();
//   router.get("/allorderlist", [authJwt.verifyToken], variantController.allorderlist);

/*********Variant API Section */
// variant List
router.get("/", variantController.list);
router.get("/list/forProdctForm", variantController.listForProdctForm);
// variant Add
router.post("/add",[authJwt.verifyToken], variantController.add);
// variant delete
router.delete("/:id",[authJwt.verifyToken], variantController.delete);
// variant update
router.put("/:id",[authJwt.verifyToken], variantController.update);
/*********Variant API Section */


/*********Variant Value API Section */
// variant value delete
router.delete("/value/:id",[authJwt.verifyToken], variantController.deleteVariantValue);
// variant value Add
router.post("/value/add",[authJwt.verifyToken], variantController.addVariantValue);
// variant value update
router.put("/value/:id",[authJwt.verifyToken], variantController.updateVariantValue);
// variant value list
router.post("/value/list", variantController.listVariantValue);
// All Variant And Value List
router.post("/all",[authJwt.verifyToken], variantController.allVariantAndValueList);
/*********Variant Value API Section */

  app.use("/api/variant", router);
};
