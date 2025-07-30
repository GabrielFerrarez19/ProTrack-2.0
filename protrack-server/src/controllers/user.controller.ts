import { Request, Response } from "express";
import { listUsers, createUser } from "../services/user.service";

export const getUsers = async (req: Request, res: Response) => {
  const users = await listUsers();
  res.json(users);
};

export const postUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await createUser(name, email);
  res.status(201).json(user);
};
