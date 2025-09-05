// services/apiClient.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8085",
  timeout: 5000, // timeout em ms
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição:", error.response?.data || error.message);

    // Se o token expirou ou é inválido, remove do localStorage
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // Redireciona para login se não estiver na página de login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(
      error.response?.data || { error: "Erro desconhecido" }
    );
  }
);
