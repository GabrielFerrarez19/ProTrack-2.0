import { Router } from "express";
import {
  createCliente,
  getAllClientes,
  getTotalClientes,
  getTotalGeralAReceberController,
  getVendasCliente,
  updateCliente,
  getClientesEmAbertoCountController,
} from "../controllers/client.controller";

const router = Router();

router.post("/clientes", createCliente);
router.get("/clientes/total", getTotalClientes);
router.get("/clientes/todos", getAllClientes);
router.put("/altera/:id", updateCliente);
router.get("/buscaVendas/:id", getVendasCliente);
router.get("/totalApagar", getTotalGeralAReceberController);
router.get("/em-aberto/count", getClientesEmAbertoCountController);

export default router;
