import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post("http://localhost:8085/login", {
    email,
    password,
  });
  return response.data;
};
