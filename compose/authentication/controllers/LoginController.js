const UserController = require("../controllers/UserController");
require("dotenv-safe").config();
var jwt = require("jsonwebtoken");

module.exports = {
  async login(request, response) {
    if (request.body && Object.keys(request.body).length > 0) {
      const user = await UserController.findOne(request);
      if (
        request.body.username === user.username &&
        request.body.password === user.password
      ) {
        const id = 1;
        var token = jwt.sign({ id }, process.env.SECRET, {
          expiresIn: 60 * 60 * 24,
        });
        response
          .status(200)
          .send({ auth: true, token: token, name: user.name, role: user.role });
        return response;
      }
    }
    response.status(401).send({
      type: "error",
      message: "Usuário ou senha inválidos!",
      data: [],
    });
  },
};
