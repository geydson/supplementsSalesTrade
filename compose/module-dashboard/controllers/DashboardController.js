import DashBoard from "../models/DashBoard.js";

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
