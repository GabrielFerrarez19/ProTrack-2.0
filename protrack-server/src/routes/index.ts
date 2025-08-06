import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./user.routes";
import productRoutes from "./productRoutes";
import clientRoutes from "./clientRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("API Online ✅");
});

router.use("/login", authRoutes);
router.use("/users", userRoutes);
router.use("/product", productRoutes);
router.use("/clients", clientRoutes);

export default router;
