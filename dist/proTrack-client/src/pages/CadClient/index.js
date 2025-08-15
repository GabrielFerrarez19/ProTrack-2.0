"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacUsers = CacUsers;
const header_1 = require("../../components/header");
const ClientForm_1 = require("./components/ClientForm");
function CacUsers() {
    return (<div className="p-4 md:p-8">
      <header_1.Header title="Bem vindo a página cadastro de clientes!" text="Aqui você pode cadastrar novos produtos no seu estoque"/>
      <ClientForm_1.ClientForm />
    </div>);
}
