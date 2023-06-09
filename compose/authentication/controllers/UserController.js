const User = require("../models/User");

module.exports = {
  async index(request, response) {
    const users = await User.find();
    return response.json(users);
  },

  async findOne(request, response) {
    const { username, password } = request.body;
    const user = await User.findOne({
      username,
      password,
    });
    return user;
  },

  async register(request, response) {
    const { username, name, password, role } = request.body;

    if (
      username != undefined &&
      name != undefined &&
      password != undefined &&
      role != undefined
    ) {
      const user = await User.create({
        name,
        username,
        password,
        role,
      });
      return response.json(user);
    }

    response.send({
      type: "error",
      message: "Dados informados são inválidos!",
      data: [],
    });
  },
};
