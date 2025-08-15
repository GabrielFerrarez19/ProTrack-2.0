"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClientes = useClientes;
const react_1 = require("react");
const api_1 = require("../services/api");
function useClientes() {
    const [clientes, setClientes] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        async function loadClientes() {
            try {
                const data = await (0, api_1.fetchAllClientes)();
                setClientes(data.clientes.map((c) => ({
                    ...c,
                    id: String(c.id),
                })));
            }
            catch {
                setError("Erro ao carregar clientes");
            }
            finally {
                setLoading(false);
            }
        }
        loadClientes();
    }, []);
    return { clientes, loading, error };
}
