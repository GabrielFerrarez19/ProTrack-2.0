// services/apiClient.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://18.191.70.76:8085",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de erro global (opcional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição:", error.response?.data || error.message);
    return Promise.reject(
      error.response?.data || { error: "Erro desconhecido" }
    );
  }
);
