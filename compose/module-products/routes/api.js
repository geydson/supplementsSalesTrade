import { Router } from "express";
import { Auth } from "../middlewares/auth.js";
import * as ProductsController from "../controllers/ProductsController.js";

const router = Router();

router.post("/products", Auth.private, ProductsController.register);
router.get("/products", Auth.private, ProductsController.list);
router.put("/products/:id", Auth.private, ProductsController.update);
router.delete("/products/:id", Auth.private, ProductsController.exclude);

export default router;
