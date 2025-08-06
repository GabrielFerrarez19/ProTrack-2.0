import { Router } from "express";
import {
  createCliente,
  getTotalClientes,
} from "../controllers/client.controller";

const router = Router();

router.post("/clientes", createCliente);
router.get("/clientes/total", getTotalClientes);

export default router;
