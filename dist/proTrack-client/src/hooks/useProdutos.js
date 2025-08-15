"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProdutos = useProdutos;
const react_1 = require("react");
const api_1 = require("../services/api");
function useProdutos() {
    const [produtos, setProdutos] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        async function loadProdutos() {
            try {
                const data = await (0, api_1.fetchAllProdutos)();
                setProdutos(data);
            }
            catch {
                setError("Erro ao carregar produtos");
            }
            finally {
                setLoading(false);
            }
        }
        loadProdutos();
    }, []);
    return { produtos, loading, error };
}
