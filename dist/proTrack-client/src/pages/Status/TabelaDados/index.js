"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableData = TableData;
const card_1 = require("../../../components/ui/card");
const table_1 = require("../../../components/ui/table");
function TableData() {
    const tableData = [
        { codigo: "1", cliente: "Pessoa 1", valor: "R$ 200", situacao: "Vendido" },
        { codigo: "2", cliente: "Pessoa 2", valor: "R$ 300", situacao: "Vendido" },
        { codigo: "3", cliente: "Pessoa 3", valor: "R$ 500", situacao: "Vendido" },
        { codigo: "4", cliente: "Pessoa 4", valor: "R$ 400", situacao: "Vendido" },
    ];
    return (<card_1.Card className="shadow-lg">
      <card_1.CardContent className="p-6">
        <table_1.Table>
          <table_1.TableHeader>
            <table_1.TableRow>
              <table_1.TableHead>Código</table_1.TableHead>
              <table_1.TableHead>Cliente</table_1.TableHead>
              <table_1.TableHead>Valor</table_1.TableHead>
              <table_1.TableHead>Situação</table_1.TableHead>
            </table_1.TableRow>
          </table_1.TableHeader>
          <table_1.TableBody>
            {tableData.map((row) => (<table_1.TableRow key={row.codigo}>
                <table_1.TableCell className="font-medium">{row.codigo}</table_1.TableCell>
                <table_1.TableCell>{row.cliente}</table_1.TableCell>
                <table_1.TableCell>{row.valor}</table_1.TableCell>
                <table_1.TableCell>{row.situacao}</table_1.TableCell>
              </table_1.TableRow>))}
          </table_1.TableBody>
        </table_1.Table>
      </card_1.CardContent>
    </card_1.Card>);
}
