"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsStatus = CardsStatus;
const react_1 = require("react");
const card_1 = require("../../../components/ui/card");
const api_1 = require("../../../services/api");
function CardsStatus() {
    // Estados
    const [totalEstoque, setTotalEstoque] = (0, react_1.useState)(0);
    const [loadingEstoque, setLoadingEstoque] = (0, react_1.useState)(true);
    const [erroEstoque, setErroEstoque] = (0, react_1.useState)(null);
    const [totalClientes, setTotalClientes] = (0, react_1.useState)(0);
    const [loadingClientes, setLoadingClientes] = (0, react_1.useState)(true);
    const [erroClientes, setErroClientes] = (0, react_1.useState)(null);
    const [totalVendas, setTotalVendas] = (0, react_1.useState)(0);
    const [loadingVendas, setLoadingVendas] = (0, react_1.useState)(true);
    const [erroVendas, setErroVendas] = (0, react_1.useState)(null);
    // Estoque
    (0, react_1.useEffect)(() => {
        const fetchEstoque = async () => {
            try {
                const data = await (0, api_1.fetchTotalEstoque)();
                setTotalEstoque(data.totalEstoque);
                setErroEstoque(null);
            }
            catch (err) {
                console.error("Erro ao buscar estoque:", err);
                setErroEstoque("Erro ao buscar estoque");
            }
            finally {
                setLoadingEstoque(false);
            }
        };
        fetchEstoque();
    }, []);
    // Clientes
    (0, react_1.useEffect)(() => {
        const fetchClientes = async () => {
            try {
                const data = await (0, api_1.fetchTotalClientes)();
                setTotalClientes(data.totalClientes);
                setErroClientes(null);
            }
            catch (err) {
                console.error("Erro ao buscar clientes:", err);
                setErroClientes("Erro ao buscar clientes");
            }
            finally {
                setLoadingClientes(false);
            }
        };
        fetchClientes();
    }, []);
    // Vendas
    (0, react_1.useEffect)(() => {
        const fetchVendas = async () => {
            try {
                const data = await (0, api_1.fetchTotalVendas)();
                setTotalVendas(data.totalVendas);
                console.log(data.totalVendas);
                console.log("test");
                setErroVendas(null);
            }
            catch (err) {
                console.error("Erro ao buscar vendas:", err); // corrigido
                setErroVendas("Erro ao buscar vendas"); // corrigido
            }
            finally {
                setLoadingVendas(false);
            }
        };
        fetchVendas();
    }, []);
    const statsData = [
        {
            title: "Vendas",
            value: loadingVendas
                ? "..."
                : erroVendas
                    ? "Erro"
                    : totalVendas.toString(),
            color: "text-red-500",
            bgColor: "bg-red-50",
        },
        {
            title: "Clientes",
            value: loadingClientes
                ? "..."
                : erroClientes
                    ? "Erro"
                    : totalClientes.toString(),
            color: "text-blue-500",
            bgColor: "bg-blue-50",
        },
        {
            title: "Estoque",
            value: loadingEstoque
                ? "..."
                : erroEstoque
                    ? "Erro"
                    : totalEstoque.toString(),
            color: "text-green-500",
            bgColor: "bg-green-50",
        },
    ];
    return (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (<card_1.Card key={stat.title} className="shadow-lg">
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {stat.title}
                </h3>
                <p className={`text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <div className={`w-12 h-12 rounded-full border-4 ${index === 0
                ? "border-red-500"
                : index === 1
                    ? "border-blue-500"
                    : "border-green-500"} border-t-transparent`}>
                  <div className="text-xs text-center mt-3 text-muted-foreground">
                    0,00%
                  </div>
                </div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>))}
    </div>);
}
