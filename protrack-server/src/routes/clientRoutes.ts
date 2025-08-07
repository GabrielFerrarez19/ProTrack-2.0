import { Router } from "express";
import {
  createCliente,
  getAllClientes,
  getTotalClientes,
} from "../controllers/client.controller";

const router = Router();

router.post("/clientes", createCliente);
router.get("/clientes/total", getTotalClientes);
router.get("/clientes/todos", getAllClientes);

export default router;
