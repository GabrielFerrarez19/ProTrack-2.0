"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pagamento_controller_1 = require("../controllers/pagamento.controller");
const router = (0, express_1.Router)();
// Rotas para histórico de pagamentos
router.get("/historico/:clienteId", pagamento_controller_1.getHistoricoCliente);
router.get("/resumo/:clienteId", pagamento_controller_1.getResumoPagamentos);
exports.default = router;
