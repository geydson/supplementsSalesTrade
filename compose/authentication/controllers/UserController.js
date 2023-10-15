import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const register = async (request, response) => {
  if (
    request.body.username &&
    request.body.password &&
    request.body.name &&
    request.body.role
  ) {
    let { username, password, name, role, codVend } = request.body;

    let hasUser = await User.findOne({ username });

    if (!hasUser) {
      password = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        username,
        password,
        role,
        codVend: codVend,
        deleted: "",
      });

      return response.status(201).json({
        type: "success",
        message: "",
        data: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
          codVend: user.codVend,
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

export const update = async (request, response) => {
  const id = request.params.id;
  const infosUpdate = request.body;
  let updates = {};
  let data = {
    type: "error",
    message: "",
    data: null,
  };

  const usr = await User.findOne({ _id: id, deleted: "" });

  if (usr) {
    if (infosUpdate.username) {
      const userCheck = await User.findOne({ username: infosUpdate.username });
      if (userCheck && usr.username != infosUpdate.username) {
        data.message = "Nome do usuário de acesso já existe!";
        response.json(data);
        return;
      }
      updates.username = infosUpdate.username;
    }

    if (infosUpdate.name) {
      if (infosUpdate.name.length < 3) {
        data.message = "Nome deve possuir no minimo 3 caracteres!";
        response.json(data);
        return;
      }
      updates.name = infosUpdate.name;
    }

    if (infosUpdate.role) {
      if (infosUpdate.role >= 1 && infosUpdate.role <= 3)
        updates.role = infosUpdate.role;
      else {
        data.message = "Tipo de acesso inválido!";
        response.json(data);
        return;
      }
    }

    if (infosUpdate.codVend || infosUpdate.codVend == null) {
      if (isNaN(infosUpdate.codVend) && infosUpdate.codVend != null) {
        data.message = "Código de vendedor inválido!";
        response.json(data);
        return;
      }
      updates.codVend =
        infosUpdate.codVend != null
          ? infosUpdate.codVend.toString().padStart(3, "0")
          : null;
    }

    if (infosUpdate.password) {
      if (infosUpdate.password.length < 3) {
        data.message = "Senha deve possuir no minimo 3 caracteres!";
        response.json(data);
        return;
      }

      updates.password = await bcrypt.hash(infosUpdate.password, 10);
    }

    const result = await User.findOneAndUpdate({ _id: id }, { $set: updates });

    if (result) {
      data.message = "Dados do usuário atualizado com successo!";
      data.type = "success";
    } else data.message = "Ocorreu um erro ao atualizar o cadastro!";
  } else {
    data.message = "Usuário não encontrado!";
  }

  response.json(data);
};

export const excludeUser = async (request, response) => {
  const id = request.params.id;
  let updates = {};
  let data = {
    type: "error",
    message: "",
    data: null,
  };

  const usr = await User.findOne({ _id: id, deleted: "" });

  if (usr) {
    const result = await User.findOneAndUpdate(
      { _id: id },
      { $set: { deleted: "*" } }
    );

    if (result) {
      data.message = "Usuário excluído com successo!";
      data.type = "success";
    } else data.message = "Ocorreu um erro ao excluir o usuário!";
  } else {
    data.message = "Usuário não encontrado!";
  }

  response.status(201).send(data);
};

export const list = async (request, response) => {
  const users = await User.find({ deleted: "" }, { password: 0, __v: 0 });

  response.json({
    type: "success",
    message: "",
    data: users,
  });
};

// const User = require("../models/User");

// module.exports = {
//   async index(request, response) {
//     const users = await User.find();
//     return response.json(users);
//   },

//   async findOne(request, response) {
//     const { username, password } = request.body;
//     const user = await User.findOne({
//       username,
//       password,
//     });
//     return user;
//   },

//   async register(request, response) {
//     const { username, name, password, role } = request.body;

//     if (
//       username != undefined &&
//       name != undefined &&
//       password != undefined &&
//       role != undefined
//     ) {
//       const user = await User.create({
//         name,
//         username,
//         password,
//         role,
//       });
//       return response.json(user);
//     }

//     response.send({
//       type: "error",
//       message: "Dados informados são inválidos!",
//       data: [],
//     });
//   },
// };
