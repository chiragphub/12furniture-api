const { authJwt } = require("../middlewares");
module.exports = app => {
  const settingController = require("../controllers/setting.controller.js");
  const router = require("express").Router();


/* HeaderLogo API Section */
router.post("/headerlogo/save",[authJwt.verifyToken], settingController.saveHeaderLogo);
/* HeaderLogo API Section */

/* FooterLogo API Section */
router.post("/footerlogo/save",[authJwt.verifyToken], settingController.saveFooterLogo);
/* FooterLogo API Section */

/* Address API Section */
router.post("/contactinformation/save",[authJwt.verifyToken], settingController.saveContactInformation);
/* Address API Section */

// /* SocialMedia API Section */
router.post("/socialmedia/save",[authJwt.verifyToken], settingController.addSocialMedia);
// /* SocialMedia API Section */

// /* add Payment API Section */
router.post("/payment/save",[authJwt.verifyToken], settingController.addPayment);
// /* add Payment API Section */

// /* add General API Section */
router.post("/general/save",[authJwt.verifyToken], settingController.addGeneral);
// /* add General API Section */

// /* Get Value By Name API Section */
router.post("/value", settingController.getSettingValueByName);
// /* Get Value By Name API Section */

router.get("/list", settingController.list);

router.get("/name-value-list", settingController.nameValueList);

  app.use("/api/setting", router);
};
