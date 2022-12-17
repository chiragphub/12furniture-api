module.exports = app => {
  const cartItemController = require("../controllers/cart_item.controller.js");

  const router = require("express").Router();


  router.post("/list", cartItemController.findAll); //,[authJwt.verifyToken]
  router.post("/", cartItemController.create);
  // router.get("/cron", cartItemController.cartCron); //,[authJwt.verifyToken]
  router.get("/:id", cartItemController.findOne); //,[authJwt.verifyToken]
  

  router.put("/:id", cartItemController.update);

  router.delete("/:id", cartItemController.delete);

  app.use("/api/cartitem", router);
};
