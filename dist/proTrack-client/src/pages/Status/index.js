"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = Status;
const header_1 = require("../../components/header");
const CardsClientes_1 = require("./CardsClientes");
const CardsStatus_1 = require("./CardsStatus");
const TabelaDados_1 = require("./TabelaDados");
function Status() {
    return (<div className="p-6 space-y-6 w-full">
      <header_1.Header title="Bem vindo a página Status!" text="Aqui você pode acompanhar alguns dados da sua empresa"/>
      {/* Stats Cards */}

      <CardsStatus_1.CardsStatus />

      {/* People Cards */}
      <CardsClientes_1.CardsClientes />
      {/* Table */}
      <TabelaDados_1.TableData />
    </div>);
}
