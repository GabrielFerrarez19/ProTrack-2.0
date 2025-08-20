"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendas = Vendas;
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const button_1 = require("../../components/ui/button");
const schemaVendas_1 = require("../../schemas/schemaVendas");
const InformacoesVenda_1 = require("./components/InformacoesVenda");
const ResumoVenda_1 = require("./components/ResumoVenda");
const ProdutosTable_1 = require("./components/ProdutosTable");
const header_1 = require("../../components/header");
const useProdutos_1 = require("../../hooks/useProdutos");
const react_1 = require("react");
const api_1 = require("../../services/api");
function Vendas() {
    const methods = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(schemaVendas_1.vendaSchema),
        defaultValues: {
            clienteId: "",
            dataVenda: new Date().toISOString().split("T")[0],
            desconto: 0,
            total: 0,
            totalComDesconto: 0,
            status: "Pendente", // valor padrão
            produtos: [],
        },
    });
    const { fields, append, remove } = (0, react_hook_form_1.useFieldArray)({
        control: methods.control,
        name: "produtos",
    });
    const watchedProdutos = methods.watch("produtos");
    const { produtos } = (0, useProdutos_1.useProdutos)();
    const [totalGeral, setTotalGeral] = (0, react_1.useState)(0);
    const [totalComDesconto, setTotalComDesconto] = (0, react_1.useState)(0);
    const atualizarPrecoProduto = (index, produtoId) => {
        const produto = produtos.find((p) => String(p.id) === produtoId);
        if (produto) {
            methods.setValue(`produtos.${index}.precoUnitario`, produto.preco_venda ?? 0);
        }
        else {
            methods.setValue(`produtos.${index}.precoUnitario`, 0);
        }
    };
    const onSubmit = async (data) => {
        data.totalComDesconto = totalComDesconto;
        data.total = totalGeral;
        console.log("Dados da venda:", data);
        try {
            const vendaParaEnviar = {
                clienteId: data.clienteId,
                dataVenda: data.dataVenda,
                desconto: data.desconto,
                total: data.total,
                totalComDesconto: data.totalComDesconto,
                status: "pendente", // envia sempre como pendente
                produtos: data.produtos.map((p) => ({
                    produtoId: p.produtoId,
                    quantidade: p.quantidade,
                    precoUnitario: p.precoUnitario,
                    desconto: p.desconto ?? 0,
                })),
            };
            const resposta = await (0, api_1.criarVenda)(vendaParaEnviar);
            console.log("Venda cadastrada com sucesso:", resposta);
            alert("Produto cadastrado com sucesso");
            methods.reset({
                clienteId: "",
                dataVenda: new Date().toISOString().split("T")[0],
                desconto: 0,
                total: 0,
                totalComDesconto: 0,
                status: "Pendente", // reset também mantém o padrão
                produtos: [],
            });
            setTotalGeral(0);
            setTotalComDesconto(0);
        }
        catch (error) {
            console.error("Erro ao cadastrar venda:", error);
        }
    };
    return (<div className="p-6 space-y-6">
      <header_1.Header title="Bem vindo a página Venda!" text="Aqui você pode registar suas vendas"/>

      <react_hook_form_1.FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InformacoesVenda_1.InformacoesVenda control={methods.control}/>
            <ResumoVenda_1.ResumoVenda produtos={watchedProdutos} onChangeResumo={({ totalPreco, valorComDesconto }) => {
            setTotalGeral(totalPreco);
            setTotalComDesconto(valorComDesconto);
        }}/>
          </div>

          <ProdutosTable_1.ProdutosTable fields={fields} append={append} remove={remove} control={methods.control} atualizarPrecoProduto={atualizarPrecoProduto} produtos={produtos}/>

          <div className="flex justify-end space-x-4">
            <button_1.Button type="button" variant="outline" onClick={() => {
            methods.reset({
                clienteId: "",
                dataVenda: new Date().toISOString().split("T")[0],
                desconto: 0,
                total: 0,
                totalComDesconto: 0,
                status: "Pendente",
                produtos: [],
            });
            setTotalGeral(0);
            setTotalComDesconto(0);
        }} className="cursor-pointer">
              Cancelar
            </button_1.Button>
            <button_1.Button type="submit" className="bg-green-600 hover:bg-green-500 cursor-pointer">
              Cadastrar Venda
            </button_1.Button>
          </div>
        </form>
      </react_hook_form_1.FormProvider>
    </div>);
}
