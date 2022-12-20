const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  app.get("/.netlify/functions/api/test/all", controller.allAccess);

  app.get("/.netlify/functions/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/.netlify/functions/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
 
  app.get(
    "/.netlify/functions/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );


  app.get("/.netlify/functions/api/user/", [authJwt.verifyToken], controller.list);
  app.delete("/.netlify/functions/api/user/:id", [authJwt.verifyToken], controller.delete);
  app.post("/.netlify/functions/api/user/changePassword", [authJwt.verifyToken], controller.changePassword);
  // app.put("/.netlify/functions/api/user/:id", [authJwt.verifyToken], controller.update);
  app.post(
    "/.netlify/functions/api/user/add",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      // verifySignUp.checkRolesExisted
    ],
    controller.add
  );
  app.put(
    "/.netlify/functions/api/user/:id",
    [
      // verifySignUp.checkDuplicateUsernameOrEmail,
      // verifySignUp.checkRolesExisted
    ],
    controller.update
  );

};
