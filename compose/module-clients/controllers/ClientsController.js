import dotenv from "dotenv-safe";
import jwt from "jsonwebtoken";
import Clients from "../models/Clients.js";

dotenv.config();

export const loadCheckClient = async (request, response) => {
  const codIdentification = request.params.codIdentification;
  let data = {
    type: "error",
    message: "",
    data: null,
  };

  if (codIdentification) {
    let hasClient = await Clients.findOne({ codIdent: codIdentification });
    if (!hasClient) {
      let req = await fetch(
        "https://www.receitaws.com.br/v1/cnpj/" + codIdentification,
        { method: "get", headers: { "Content-Type": "application/json" } }
      );

      const result = await req.json();

      if (result && result?.status.toLowerCase() != "error") {
        const newCep = result?.cep
          ? result.cep.replace(/[^\d]/g, "")
          : result.cep;

        data.type = "success";
        data.data = {
          nameRazao: result.nome,
          nameFant: result.fantasia,
          cep: newCep,
          city: result.municipio,
          state: result.uf,
          bairro: result.bairro,
          logradouro: result.logradouro,
          complement: result.complemento,
          number: result.numero,
        };
      } else if (result && result?.status.toLowerCase() == "error") {
        data.message = result?.message ? result?.message : "Ocorreu um erro!";
      } else {
        data.type = "warning";
        data.message = "Não foi possível obter os dados, preencha manualmente!";
      }
    } else {
      data.message = "Cliente já possuí cadastro!";
    }
  } else {
    data.message = "CNPJ inválido!";
  }

  response.status(201).send(data);
};

export const list = async (request, response) => {
  let codVend = null;
  let role = null;
  let clients = [];

  if (request.headers.authorization) {
    const [authType, token] = request.headers.authorization.split(" ");
    if (authType === "Bearer") {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);

        codVend = decoded?.codVend;
        role = decoded?.role;
      } catch (error) {}
    }
  }

  if (role && role < 3) clients = await Clients.find({ deleted: "" });
  else if (codVend != null)
    clients = await Clients.find({ deleted: "", codVend });

  response.json({
    type: "success",
    message: "",
    data: clients,
  });
};

export const register = async (request, response) => {
  if (
    request.body?.state &&
    request.body?.city &&
    request.body?.nameFant &&
    request.body?.nameRazao &&
    request.body?.bairro &&
    request.body?.number &&
    request.body?.cep &&
    request.body?.logradouro &&
    request.body?.codIdentification &&
    request.body?.codVend
  ) {
    let {
      state,
      city,
      nameFant,
      nameRazao,
      bairro,
      number,
      cep,
      logradouro,
      codIdentification,
      codVend,
      complement,
    } = request.body;

    const newCep = cep.replace(/[^\d]/g, "");
    const newCodIdentification = codIdentification.replace(/[^\d]/g, "");

    let hasClient = await Clients.findOne({ codIdent: newCodIdentification });

    if (!hasClient) {
      const finishCli = await Clients.create({
        codIdent: newCodIdentification,
        razaoSocial: nameRazao,
        nameFantasia: nameFant,
        codVend: codVend.toString().padStart(3, "0"),
        city,
        state,
        cep: newCep,
        bairro,
        logradouro,
        complement,
        number,
        deleted: "",
      });

      return response.status(201).json({
        type: finishCli ? "success" : "error",
        message: finishCli
          ? "Cadastro do cliente realizado com sucesso!"
          : "Ocorreu um erro ao realizar o cadastro!",
        data: null,
      });
    } else {
      return response.json({
        type: "error",
        message: "Cliente já cadastrado!",
        data: [],
      });
    }
  }

  response.json({
    error: "Estão faltando dados para realizar o cadastro do cliente!",
  });
};

export const excludeClient = async (request, response) => {
  const id = request.params.id;
  let data = {
    type: "error",
    message: "",
    data: null,
  };

  const client = await Clients.findOne({ _id: id, deleted: "" });

  if (client) {
    const result = await Clients.findOneAndUpdate(
      { _id: id },
      { $set: { deleted: "*" } }
    );

    if (result) {
      data.message = "Cliente excluído com successo!";
      data.type = "success";
    } else data.message = "Ocorreu um erro ao excluir o cliente!";
  } else {
    data.message = "Cliente não encontrado!";
  }

  response.status(201).send(data);
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

  const client = await Clients.findOne({ _id: id, deleted: "" });

  if (client) {
    updates.razaoSocial = infosUpdate.nameRazao;
    updates.nameFantasia = infosUpdate.nameFant;
    updates.city = infosUpdate.city;
    updates.state = infosUpdate.state;
    updates.cep = infosUpdate.cep;
    updates.bairro = infosUpdate.bairro;
    updates.logradouro = infosUpdate.logradouro;
    updates.complement = infosUpdate.complement;
    updates.number = infosUpdate.number;

    if (infosUpdate.codVend && infosUpdate.codVend.length > 0) {
      if (isNaN(infosUpdate.codVend) && infosUpdate.codVend != null) {
        data.message = "Código do vendedor inválido!";
        response.json(data);
        return;
      }

      updates.codVend = infosUpdate.codVend.toString().padStart(3, "0");
    } else {
      data.message = "Código do vendedor inválido!";
      response.json(data);
      return;
    }

    const result = await Clients.findOneAndUpdate(
      { _id: id },
      { $set: updates }
    );

    if (result) {
      data.message = "Dados do usuário atualizado com successo!";
      data.type = "success";
    } else data.message = "Ocorreu um erro ao atualizar o cadastro!";
  } else {
    data.message = "Cliente não encontrado!";
  }

  response.json(data);
};
