import Products from "../models/Products.js";

export const register = async (request, response) => {
  if (
    request.body?.name &&
    request.body?.codProd &&
    request.body?.desc &&
    request.body?.stock &&
    request.body?.price
  ) {
    let { name, codProd, desc, stock, price } = request.body;

    let newPrice = price.replace(/\./gi, "").replace(/,/gi, ".");
    newPrice = parseFloat(newPrice).toFixed(2);
    const newStock = parseInt(stock.toString().replace(/[^\d]/g, ""));

    let hasProduct = await Products.findOne({ codProd });

    if (!hasProduct) {
      const finishProd = await Products.create({
        name,
        codProd,
        desc,
        stock: newStock,
        price: newPrice,
        dateCreated: new Date(),
        deleted: "",
      });

      return response.status(201).json({
        type: finishProd ? "success" : "error",
        message: finishProd
          ? "Cadastro do produto realizado com sucesso!"
          : "Ocorreu um erro ao cadastrar produto!",
        data: null,
      });
    } else {
      return response.json({
        type: "error",
        message: "Produto já cadastrado!",
        data: [],
      });
    }
  }

  response.json({
    error: "Estão faltando dados para realizar o cadastro do produto!",
  });
};

export const list = async (request, response) => {
  const productList = await Products.find({ deleted: "" });

  response.json({
    type: "success",
    message: "",
    data: productList,
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

  const product = await Products.findOne({ _id: id, deleted: "" });

  if (product) {
    if (infosUpdate?.name) updates.name = infosUpdate.name;

    if (infosUpdate?.codProd) updates.codProd = infosUpdate.codProd;

    if (infosUpdate?.desc) updates.desc = infosUpdate.desc;

    updates.stock = parseInt(
      infosUpdate.stock.toString().replace(/[^\d]/g, "")
    );
    updates.price = infosUpdate.price.replace(/\./gi, "").replace(/,/gi, ".");
    updates.price = parseFloat(updates.price).toFixed(2);

    if (updates.price <= 0) {
      data.message = "Valor do produto inválido!";
      response.json(data);
      return;
    }

    if (!(updates.stock >= 0)) {
      data.message = "Valor informado para o estoque é inválido!";
      response.json(data);
      return;
    }

    const result = await Products.findOneAndUpdate(
      { _id: id },
      { $set: updates }
    );

    if (result) {
      data.message = "Dados do produto atualizado com successo!";
      data.type = "success";
    } else data.message = "Ocorreu um erro ao atualizar o produto!";
  } else {
    data.message = "Produto não encontrado!";
  }

  response.json(data);
};

export const exclude = async (request, response) => {
  const id = request.params.id;
  let data = {
    type: "error",
    message: "",
    data: null,
  };

  const prod = await Products.findOne({ _id: id, deleted: "" });

  if (prod) {
    const result = await Products.findOneAndUpdate(
      { _id: id },
      { $set: { deleted: "*" } }
    );

    if (result) {
      data.message = "Produto excluído com successo!";
      data.type = "success";
    } else data.message = "Ocorreu um erro ao excluir o produto!";
  } else {
    data.message = "Produto não encontrado!";
  }

  response.status(201).send(data);
};
