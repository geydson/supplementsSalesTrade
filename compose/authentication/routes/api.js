import { Router } from "express";
import { Auth } from "../middlewares/auth.js";
import * as ApiController from "../controllers/ApiController.js";

const router = Router();

router.post("/login", ApiController.login);
router.post("/users", ApiController.register);
router.get("/users", Auth.private, ApiController.list);

export default router;
