import User from "../models/User.js";
import dotenv from "dotenv-safe";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

export const ping = (request, response) => {
  response.json({ pong: true });
};

export const register = async (request, response) => {
  if (
    request.body.username &&
    request.body.password &&
    request.body.name &&
    request.body.role
  ) {
    let { username, password, name, role } = request.body;

    let hasUser = await User.findOne({ username });

    if (!hasUser) {
      password = bcrypt.hashSync(password, 10);

      const user = await User.create({ name, username, password, role });

      return response.status(201).json({
        type: "success",
        message: "",
        data: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
      });
    } else {
      return response.json({
        type: "error",
        message: "Usuário já existe!",
        data: [],
      });
    }
  }

  response.json({
    error: "Estão faltando dados para realizar o registro de usuário!",
  });
};

export const login = async (request, response) => {
  const { username, password } = request.body;
  if (username && password) {
    const user = await User.findOne({ username });

    if (
      user &&
      request.body.username === user.username &&
      bcrypt.compareSync(password, user.password)
    ) {
      var token = jwt.sign({ id: user._id, username }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24,
        algorithm: "HS256",
        issuer: process.env.KEY,
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
};

export const list = async (request, response) => {
  const users = await User.find({}, { password: 0, __v: 0 });

  response.json({
    type: "success",
    message: "",
    data: users,
  });
};
