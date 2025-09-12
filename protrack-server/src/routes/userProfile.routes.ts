import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  updateCurrentUser,
  updateUserById,
  changeUserStatus,
  listAllUsers,
  logout,
  createUserController,
  deleteUserController,
  searchUsersController,
  getUsersByStatusController,
  getUsersByRoleController,
  getUsersByDepartmentController,
} from "../controllers/user.controller";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Rotas que requerem autenticação
router.use(authenticateToken);

// Rotas para o usuário atual
router.get("/me", getCurrentUser);
router.put("/me", updateCurrentUser);
router.post("/logout", logout);

// Rotas administrativas (apenas para admins)
router.get("/all", requireRole(["admin"]), listAllUsers);
router.get("/search", requireRole(["admin"]), searchUsersController);
router.get(
  "/status/:status",
  requireRole(["admin"]),
  getUsersByStatusController
);
router.get("/role/:role", requireRole(["admin"]), getUsersByRoleController);
router.get(
  "/department/:departamento_id",
  requireRole(["admin"]),
  getUsersByDepartmentController
);
router.post("/create", requireRole(["admin"]), createUserController);
router.get("/:id", requireRole(["admin"]), getUserById);
router.put("/:id", requireRole(["admin"]), updateUserById);
router.patch("/:id/status", requireRole(["admin"]), changeUserStatus);
router.delete("/:id", requireRole(["admin"]), deleteUserController);

export default router;
