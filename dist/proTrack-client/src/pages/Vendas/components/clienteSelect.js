"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteSelect = ClienteSelect;
const react_select_1 = __importDefault(require("react-select"));
const form_1 = require("../../../components/ui/form");
function ClienteSelect({ control, name, clientes, label = "Cliente", placeholder = "Selecione um cliente", }) {
    return (<form_1.FormField control={control} name={name} render={({ field }) => {
            // Procura a opção selecionada no formato { value, label }
            const selectedOption = clientes
                .map((c) => ({ value: c.id, label: `${c.nome} - ${c.email}` }))
                .find((opt) => opt.value === field.value) || null;
            return (<form_1.FormItem>
            <form_1.FormLabel>{label}</form_1.FormLabel>
            <form_1.FormControl>
              <react_select_1.default options={clientes.map((c) => ({
                    value: c.id,
                    label: `${c.nome} - ${c.cpf}`,
                }))} value={selectedOption} onChange={(option) => {
                    field.onChange(option ? option.value : "");
                }} isClearable placeholder={placeholder}/>
            </form_1.FormControl>
            <form_1.FormMessage />
          </form_1.FormItem>);
        }}/>);
}
