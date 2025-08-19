// services/apiClient.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8085",
  timeout: 5000, // timeout em ms
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de erro global (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição:", error.response?.data || error.message);
    return Promise.reject(
      error.response?.data || { error: "Erro desconhecido" }
    );
  }
);
