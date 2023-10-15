import { Router } from "express";
import { Auth } from "../middlewares/auth.js";
import * as AuthController from "../controllers/AuthController.js";
import * as UserController from "../controllers/UserController.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/validateToken", AuthController.validateToken);
router.post("/logout", Auth.private, AuthController.logout);
router.post("/users", Auth.private, UserController.register);
router.put("/users/:id", Auth.private, UserController.update);
router.delete("/users/:id", Auth.private, UserController.excludeUser);
router.get("/users", Auth.private, UserController.list);

export default router;
