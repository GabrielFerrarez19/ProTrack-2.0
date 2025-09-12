import { Request, Response } from "express";
import {
  findUserById,
  updateUser,
  updateUserStatus,
  getAllUsers,
  createUser,
  findUserByEmail,
} from "../services/user.service";

// Importar funções adicionais usando require para evitar problemas de cache
const userService = require("../services/user.service");

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Erro ao buscar usuário atual:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const user = await findUserById(BigInt(id));

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { name, email, username, role, empresa_id, departamento_id } =
      req.body;

    const updateData: any = {
      name,
      email,
      username,
      role,
    };

    if (empresa_id !== undefined) {
      updateData.empresa_id = BigInt(empresa_id);
    }

    if (departamento_id !== undefined) {
      updateData.departamento_id = BigInt(departamento_id);
    }

    const result = await updateUser(
      BigInt(req.user.id),
      updateData,
      BigInt(req.user.id)
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const { name, email, username, role, empresa_id, departamento_id } =
      req.body;

    const updateData: any = {
      name,
      email,
      username,
      role,
    };

    if (empresa_id !== undefined) {
      updateData.empresa_id = BigInt(empresa_id);
    }

    if (departamento_id !== undefined) {
      updateData.departamento_id = BigInt(departamento_id);
    }

    const result = await updateUser(
      BigInt(id),
      updateData,
      req.user?.id ? BigInt(req.user.id) : undefined
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const changeUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const { status } = req.body;

    if (!["ativo", "inativo", "bloqueado"].includes(status)) {
      return res.status(400).json({
        error: "Status inválido. Use: ativo, inativo ou bloqueado",
      });
    }

    const result = await updateUserStatus(
      BigInt(id),
      status as "ativo" | "inativo" | "bloqueado",
      req.user?.id ? BigInt(req.user.id) : undefined
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Erro ao alterar status do usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const listAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Em um sistema mais robusto, você poderia invalidar o token aqui
    // Por enquanto, apenas retornamos sucesso
    return res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Novo controller para criar usuário
export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, username, role, departamento_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Nome, email e senha são obrigatórios",
      });
    }

    // Verificar se email já existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: "Email já está em uso",
      });
    }

    const userData: any = {
      name,
      email,
      password,
      username,
      role: role || "user",
    };

    if (departamento_id) {
      userData.departamento_id = BigInt(departamento_id);
    }

    if (req.user?.id) {
      userData.criado_por = BigInt(req.user.id);
    }

    await createUser(userData);

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Controller para deletar usuário
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const result = await userService.deleteUser(
      BigInt(id),
      req.user?.id ? BigInt(req.user.id) : undefined
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Controller para buscar usuários
export const searchUsersController = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Termo de busca é obrigatório" });
    }

    const users = await userService.searchUsers(q);

    return res.status(200).json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Controller para filtrar usuários por status
export const getUsersByStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.params;

    if (!status || !["ativo", "inativo", "bloqueado"].includes(status)) {
      return res.status(400).json({
        error: "Status inválido. Use: ativo, inativo ou bloqueado",
      });
    }

    const users = await userService.getUsersByStatus(status);

    return res.status(200).json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários por status:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Controller para filtrar usuários por role
export const getUsersByRoleController = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;

    const users = await userService.getUsersByRole(role);

    return res.status(200).json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários por role:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Controller para filtrar usuários por departamento
export const getUsersByDepartmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { departamento_id } = req.params;

    if (!departamento_id) {
      return res
        .status(400)
        .json({ error: "ID do departamento é obrigatório" });
    }

    const users = await userService.getUsersByDepartment(
      BigInt(departamento_id)
    );

    return res.status(200).json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários por departamento:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
