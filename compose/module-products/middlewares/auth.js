import jwt from "jsonwebtoken";
import dotenv from "dotenv-safe";

dotenv.config();

export const Auth = {
  private: async (request, response, next) => {
    let success = false;

    if (request.headers.authorization) {
      const [authType, token] = request.headers.authorization.split(" ");
      if (authType === "Bearer") {
        try {
          const decoded = jwt.verify(token, process.env.SECRET);
          success = true;
        } catch (error) {}
      }
    }

    if (success) {
      next();
    } else {
      response.status(403).send({
        type: "error",
        message: "Usuário não autorizado!",
        data: [],
      });
    }
  },
};
