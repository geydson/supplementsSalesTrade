import User from "../models/User.js";
import dotenv from "dotenv-safe";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

export const login = async (request, response) => {
  const { username, password } = request.body;
  let data = {
    type: "error",
    message: "",
    data: null,
  };

  if (username && password) {
    const user = await User.findOne({ username });

    if (
      user &&
      request.body.username === user.username &&
      bcrypt.compareSync(password, user.password)
    ) {
      const { name, role, _id, codVend } = user;

      const sellers = await getListSellers(role == 3 ? codVend : null);
      const token = jwt.sign(
        { id: user._id, username, codVend, role },
        process.env.SECRET,
        {
          expiresIn: 60 * 60 * 24,
          algorithm: "HS256",
          issuer: process.env.KEY,
        }
      );

      data.type = "success";
      data.data = {
        token,
        role,
        name,
        codVend,
        auth: true,
        _id,
        sellers,
      };

      response.status(200).send(data);
      return response;
    }
  }
  data.message = "Usuário ou senha inválidos!";
  response.status(401).send(data);
};

export const validateToken = async (request, response) => {
  let data = {
    type: "error",
    message: "",
    data: null,
  };

  if (request.headers.authorization) {
    const [authType, token] = request.headers.authorization.split(" ");
    if (authType === "Bearer") {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);

        if (decoded.id) {
          const user = await User.findOne({ _id: decoded.id });

          const { name, role, codVend } = user;

          const sellers = await getListSellers(role == 3 ? codVend : null);

          data.data = {
            name,
            role,
            codVend,
            auth: true,
            sellers,
          };

          data.type = "success";
        }

        success = true;
      } catch (error) {}
    }

    response.status(200).send(data);
    return response;
  }

  data.message = "Token inválido!";
  response.status(403).send(data);
};

export const logout = async (request, response) => {
  response.status(200).send({});
};

const getListSellers = async (codVend) => {
  // testesss
  let listSellers = await User.find(
    codVend != null ? { codVend } : { codVend: { $ne: null } }
  );
  let newListSellers = [];

  if (listSellers && listSellers.length > 0) {
    listSellers.map((i) =>
      newListSellers.push({ nome: i.name, codVend: i.codVend })
    );
  }

  return newListSellers;
};

// const UserController = require("../controllers/UserController");
// require("dotenv-safe").config();
// var jwt = require("jsonwebtoken");

// module.exports = {
//   async login(request, response) {
//     if (request.body && Object.keys(request.body).length > 0) {
//       const user = await UserController.findOne(request);
//       if (
//         request.body.username === user.username &&
//         request.body.password === user.password
//       ) {
//         const id = 1;
//         var token = jwt.sign({ id }, process.env.SECRET, {
//           expiresIn: 60 * 60 * 24,
//         });
//         response
//           .status(200)
//           .send({ auth: true, token: token, name: user.name, role: user.role });
//         return response;
//       }
//     }
//     response.status(401).send({
//       type: "error",
//       message: "Usuário ou senha inválidos!",
//       data: [],
//     });
//   },
// };
