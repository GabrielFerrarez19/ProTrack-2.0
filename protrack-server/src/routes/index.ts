import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./user.routes";

const router = Router();

router.get("/", (req, res) => {
  res.send("API Online ✅");
});

router.use("/login", authRoutes);
router.use("/users", userRoutes);

export default router;
