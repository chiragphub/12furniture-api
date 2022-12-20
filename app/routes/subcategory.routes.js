const { authJwt } = require("../middlewares");
module.exports = app => {
  const subcategoryController = require("../controllers/subcategory.controller.js");

  const router = require("express").Router();
//   router.get("/allorderlist", [authJwt.verifyToken], subcategoryController.allorderlist);

/*********category API Section */
// category List
router.post("/", subcategoryController.list);
// category Add
router.post("/add",[authJwt.verifyToken], subcategoryController.add);
// category delete
router.delete("/:id",[authJwt.verifyToken], subcategoryController.delete);
// category update
router.put("/:id",[authJwt.verifyToken], subcategoryController.update);
/*********category API Section */

  app.use("/api/subcategory", router);
};
