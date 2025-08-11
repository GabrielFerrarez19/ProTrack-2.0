import { Router } from "express";
import {
  createCliente,
  getAllClientes,
  getTotalClientes,
  updateCliente,
} from "../controllers/client.controller";

const router = Router();

router.post("/clientes", createCliente);
router.get("/clientes/total", getTotalClientes);
router.get("/clientes/todos", getAllClientes);
router.put("/altera/:id", updateCliente);

export default router;
