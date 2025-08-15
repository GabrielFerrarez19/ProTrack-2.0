"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoSelect = ProdutoSelect;
const react_select_1 = __importDefault(require("react-select"));
const form_1 = require("../../../components/ui/form");
function ProdutoSelect({ control, name, produtos = [], index, atualizarPrecoProduto, placeholder = "Selecione um produto", }) {
    return (<form_1.FormField control={control} name={name} render={({ field }) => {
            const options = produtos.map((p) => ({
                value: String(p.id),
                label: `${p.nome} - Cod: ${p.codigo_barras ?? "-"} - R$ ${p.preco_venda?.toFixed(2) ?? "0.00"}`,
            }));
            const selectedOption = options.find((opt) => opt.value === String(field.value)) || null;
            return (<form_1.FormItem>
            <form_1.FormControl>
              <react_select_1.default options={options} value={selectedOption} onChange={(option) => {
                    const value = option?.value ?? "";
                    field.onChange(value);
                    atualizarPrecoProduto(index, value);
                }} isClearable placeholder={placeholder} menuPortalTarget={document.body} // garante que o menu fique fora do fluxo do pai
             menuPlacement="auto" // abre para cima ou baixo conforme espaço
             styles={{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999, // sobrepõe todos os elementos
                    }),
                    menuList: (base) => ({
                        ...base,
                        maxHeight: 250, // altura máxima do menu
                        overflowY: "auto", // habilita scroll interno
                    }),
                }}/>
            </form_1.FormControl>
            <form_1.FormMessage />
          </form_1.FormItem>);
        }}/>);
}
