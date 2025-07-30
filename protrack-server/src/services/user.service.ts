import prisma from "../config/prisma";

export const findUserByEmailAndPassword = async (
  email: string,
  password: string
) => {
  return await prisma.user.findFirst({
    where: {
      email,
      password, // ⚠️ não recomendado usar senha em texto puro
    },
  });
};
