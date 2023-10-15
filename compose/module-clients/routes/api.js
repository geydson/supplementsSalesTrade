import { Router } from "express";
import { Auth } from "../middlewares/auth.js";
import * as ClientsController from "../controllers/ClientsController.js";

const router = Router();

router.get(
  "/loadCheckClient/:codIdentification",
  Auth.private,
  ClientsController.loadCheckClient
);
router.post("/clients", Auth.private, ClientsController.register);
router.delete("/clients/:id", Auth.private, ClientsController.excludeClient);
router.get("/clients", Auth.private, ClientsController.list);
router.put("/clients/:id", Auth.private, ClientsController.update);

export default router;
