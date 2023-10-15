import dotenv from "dotenv-safe";
import jwt from "jsonwebtoken";
import { CompressionTypes } from "kafkajs";

import Items from "../models/Items.js";
import Orders from "../models/Orders.js";

dotenv.config();

export const registerOrder = async (request, response) => {
  if (
    request.body?.razaoSocial &&
    request.body?.nameFantasia &&
    request.body?.codIdent &&
    request.body?.state &&
    request.body?.codVend &&
    request.body?.total &&
    request.body?.quantItens &&
    request.body?.items
  ) {
    let {
      razaoSocial,
      nameFantasia,
      codIdent,
      state,
      codVend,
      total,
      quantItens,
      items,
    } = request.body;

    if (items && items.length == 0) {
      return response.status(201).json({
        type: "error",
        message: "Pedido não possuí produtos!",
        data: null,
      });
    }

    const finishOrders = await Orders.create({
      state,
      codIdent,
      razaoSocial,
      nameFantasia,
      quantItens,
      total,
      dateCreated: new Date(),
      codVend,
      deleted: "",
    });

    if (finishOrders) {
      const unresolvedPromises = items.map(async (i) =>
        dataItems(i, finishOrders._id)
      );
      const results = await Promise.all(unresolvedPromises);

      // Chamar micro serviço
      const respKafka = await request.producer.send({
        topic: "data-dashboard",
        compression: CompressionTypes.GZIP,
        messages: [{ value: JSON.stringify(finishOrders) }],
      });

      return response.status(201).json({
        type: "success",
        message: "Pedido realizado com sucesso!",
        data: [request?.producer ? "Sim" : "não", respKafka],
      });
    } else {
      return response.status(201).json({
        type: "error",
        message: "Ocorreu um erro ao realizar o pedido!",
        data: null,
      });
    }
  }

  response.json({
    error: "Estão faltando dados para realizar o seu pedido!",
  });
};

export const listOrders = async (request, response) => {
  let codVend = null;
  let role = null;
  let ordersList = [];

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

  if (role && role < 3) ordersList = await Orders.find({ deleted: "" });
  else if (codVend != null)
    ordersList = await Orders.find({ deleted: "", codVend });

  response.json({
    type: "success",
    message: "",
    data: ordersList,
  });
};

const dataItems = async (i, id) => {
  await Items.create({
    id,
    codProd: i.codProd,
    name: i.name,
    price: i.price,
    quant: i.quant,
    deleted: "",
  });
};
