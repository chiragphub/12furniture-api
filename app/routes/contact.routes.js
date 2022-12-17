module.exports = app => {
  const contactController = require("../controllers/contact.controller.js");
  const router = require("express").Router();


/*********ecommerce API Section */

router.post("/add", contactController.add);
router.get("/", contactController.list);
router.delete("/:id", contactController.delete);
router.put("/:id", contactController.update);

/*********ecommerce API Section */
  
  app.use("/api/contact", router);
};
