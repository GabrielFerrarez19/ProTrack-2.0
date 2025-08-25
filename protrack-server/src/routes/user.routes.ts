import { Router } from "express";
import { createUserController, login } from "../controllers/auth.controller";

const router = Router();

router.post("/", login); // POST /login
router.post("/create", createUserController);

export default router;
