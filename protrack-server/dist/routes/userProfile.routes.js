"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Rotas que requerem autenticação
router.use(auth_middleware_1.authenticateToken);
// Rotas para o usuário atual
router.get("/me", user_controller_1.getCurrentUser);
router.put("/me", user_controller_1.updateCurrentUser);
router.post("/logout", user_controller_1.logout);
// Rotas administrativas (apenas para admins)
router.get("/all", (0, auth_middleware_1.requireRole)(["admin"]), user_controller_1.listAllUsers);
router.get("/:id", (0, auth_middleware_1.requireRole)(["admin"]), user_controller_1.getUserById);
router.put("/:id", (0, auth_middleware_1.requireRole)(["admin"]), user_controller_1.updateUserById);
router.patch("/:id/status", (0, auth_middleware_1.requireRole)(["admin"]), user_controller_1.changeUserStatus);
exports.default = router;
