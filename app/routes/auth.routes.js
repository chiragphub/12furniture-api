const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  app.post(
    "/.netlify/functions/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  /********* Admin Section API */
  app.get("/.netlify/functions/api/auth/userlist", controller.userlist);
  
  app.put("/.netlify/functions/api/auth/sellerupdate",[authJwt.verifyToken],controller.sellerupdate);
  app.delete("/.netlify/functions/api/auth/delete/:id",[authJwt.verifyToken], controller.delete);
  app.put("/.netlify/functions/api/auth/changestatus",[authJwt.verifyToken],controller.changestatus);
  app.post("/.netlify/functions/api/auth/changepassword",[authJwt.verifyToken],controller.changepassword);
/********* End Admin Section API */

  app.post("/.netlify/functions/api/auth/signin", controller.signin);
  app.post("/.netlify/functions/api/auth/loginGoogle", controller.signinGoogle);
  app.post("/.netlify/functions/api/auth/resetpassword",[authJwt.verifyToken],controller.resetpassword);
  app.post("/.netlify/functions/api/auth/basicupdate",[authJwt.verifyToken],controller.basicupdate);
  app.get("/.netlify/functions/api/auth/user",[authJwt.verifyToken],controller.user);
  app.post("/.netlify/functions/api/auth/profile_image",[authJwt.verifyToken],controller.profile_image);
  app.post("/.netlify/functions/api/auth/uploaddocument",controller.uploaddocument);
  app.post("/.netlify/functions/api/auth/forgotpassword",controller.forgotpassword);
  app.post("/.netlify/functions/api/auth/resetpassword-frontend",controller.resetpasswordfrontend);
  
};
