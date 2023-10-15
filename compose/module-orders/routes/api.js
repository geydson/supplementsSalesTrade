import { Router } from "express";
// import { CompressionTypes } from "kafkajs";
import { Auth } from "../middlewares/auth.js";
import * as OrderController from "../controllers/OrderController.js";

const router = Router();

router.post("/orders", Auth.private, OrderController.registerOrder);
router.get("/orders", Auth.private, OrderController.listOrders);
// router.post("/logout", Auth.private, AuthController.logout);
// router.post("/users", Auth.private, UserController.register);
// router.put("/users/:id", Auth.private, UserController.update);
// router.delete("/users/:id", Auth.private, UserController.excludeUser);
// router.get("/users", Auth.private, UserController.list);

export default router;
