"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoSelect = ProdutoSelect;
const react_select_1 = __importDefault(require("react-select"));
const form_1 = require("../../../components/ui/form");
function ProdutoSelect({ control, name, produtos, index, atualizarPrecoProduto, placeholder = "Selecione um produto", }) {
    return (<form_1.FormField control={control} name={name} render={({ field }) => {
            // seleciona a opção do select
            const selectedOption = produtos
                .map((p) => ({
                value: String(p.id),
                label: `${p.nome} - Cod: ${p.codigo_barras ?? "-"} - R$ ${p.preco_venda?.toFixed(2) ?? "0.00"}`,
            }))
                .find((opt) => opt.value === String(field.value)) || null;
            return (<form_1.FormItem>
            <form_1.FormControl>
              <react_select_1.default options={produtos.map((p) => ({
                    value: String(p.id),
                    label: `${p.nome} - Cod: ${p.codigo_barras ?? "-"} - R$ ${p.preco_venda?.toFixed(2) ?? "0.00"}`,
                }))} value={selectedOption} onChange={(option) => {
                    field.onChange(option ? option.value : "");
                    atualizarPrecoProduto(index, option ? option.value : "");
                }} isClearable placeholder={placeholder} menuPortalTarget={document.body} styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }} menuPlacement="top"/>
            </form_1.FormControl>
            <form_1.FormMessage />
          </form_1.FormItem>);
        }}/>);
}
