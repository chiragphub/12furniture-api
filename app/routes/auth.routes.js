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
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  /********* Admin Section API */
  app.get("/api/auth/userlist", controller.userlist);
  
  app.put("/api/auth/sellerupdate",[authJwt.verifyToken],controller.sellerupdate);
  app.delete("/api/auth/delete/:id",[authJwt.verifyToken], controller.delete);
  app.put("/api/auth/changestatus",[authJwt.verifyToken],controller.changestatus);
  app.post("/api/auth/changepassword",[authJwt.verifyToken],controller.changepassword);
/********* End Admin Section API */

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/loginGoogle", controller.signinGoogle);
  app.post("/api/auth/resetpassword",[authJwt.verifyToken],controller.resetpassword);
  app.post("/api/auth/basicupdate",[authJwt.verifyToken],controller.basicupdate);
  app.get("/api/auth/user",[authJwt.verifyToken],controller.user);
  app.post("/api/auth/profile_image",[authJwt.verifyToken],controller.profile_image);
  app.post("/api/auth/uploaddocument",controller.uploaddocument);
  app.post("/api/auth/forgotpassword",controller.forgotpassword);
  app.post("/api/auth/resetpassword-frontend",controller.resetpasswordfrontend);
  
};
