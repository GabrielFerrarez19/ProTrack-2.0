import { Router } from "express";
import userRoutes from "./user.routes";
import productRoutes from "./productRoutes";
import clientRoutes from "./clientRoutes";
import vendasRoutes from "./vendasRoutes";
import configRoutes from "./configRoutes";
import relatorioRoutes from "./relatorioRoutes";
import vendasMonitoramentoRoutes from "./vendasMonitoramentoRoutes";
import contasPagarRoutes from "./contasPagarRoutes";
import contasPagarMonitoramentoRoutes from "./contasPagarMonitoramentoRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("API Online ✅");
});

router.use("/login", userRoutes);
router.use("/users", userRoutes);
router.use("/product", productRoutes);
router.use("/clients", clientRoutes);
router.use("/vendas", vendasRoutes);
router.use("/config", configRoutes);
router.use("/relatorios", relatorioRoutes);
router.use("/monitoramento", vendasMonitoramentoRoutes);
router.use("/contas-pagar", contasPagarRoutes);
router.use("/monitoramento-contas", contasPagarMonitoramentoRoutes);

export default router;
