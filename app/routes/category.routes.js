const { authJwt } = require("../middlewares");
module.exports = app => {
  const categoryController = require("../controllers/category.controller.js");

  const router = require("express").Router();
//   router.get("/allorderlist", [authJwt.verifyToken], categoryController.allorderlist);

/*********category API Section */
// category List
router.get("/", categoryController.list);
// category Add
router.post("/add",[authJwt.verifyToken], categoryController.add);
// category delete
router.delete("/:id",[authJwt.verifyToken], categoryController.delete);
// category update
router.put("/:id",[authJwt.verifyToken], categoryController.update);
/*********category API Section */

  app.use("/api/category", router);
};
