import { Router } from "express";
import { Auth } from "../middlewares/auth.js";
import * as DashboardController from "../controllers/DashboardController.js";

const router = Router();

router.get(
  "/allInfosDashBoard",
  Auth.private,
  DashboardController.listDataDashBoard
);

export default router;
