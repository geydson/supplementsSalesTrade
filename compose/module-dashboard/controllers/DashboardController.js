import dotenv from "dotenv-safe";
import jwt from "jsonwebtoken";
import DashBoard from "../models/DashBoard.js";

dotenv.config();

export const registerDashboard = async (infos) => {
  let data = {
    type: "error",
    message: "",
    data: null,
  };

  if (infos?.codIdent && infos?.total && infos?.quantItens && infos?.codVend) {
    const finishDashBoard = await DashBoard.create({
      clientId: infos?.codIdent,
      codVend: infos?.codVend,
      totalPrice: infos?.total,
      totalQuant: infos?.quantItens,
      dateCreated: new Date(),
      deleted: "",
    });

    if (finishDashBoard) {
      data.type = "success";
      data.message = "Dados registrados com sucesso!";
      data.data = finishDashBoard;
    } else {
      data.message = "Ocorreu um erro no registro dos dados!";
    }
    return data;
  } else {
    data.message = "Está fatando campos necessários para o registro!";
    return data;
  }
};

export const listDataDashBoard = async (request, response) => {
  let codVend = null;
  let role = null;
  let dashBoardList = [];

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

  if (role && role < 3) dashBoardList = await DashBoard.find({ deleted: "" });
  else if (codVend != null)
    dashBoardList = await DashBoard.find({ deleted: "", codVend });

  response.json({
    type: "success",
    message: "",
    data: dashBoardList,
  });
};
