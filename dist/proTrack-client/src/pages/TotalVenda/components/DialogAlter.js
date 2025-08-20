"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogAlterVenda = DialogAlterVenda;
const dialog_1 = require("../../../components/ui/dialog");
const card_1 = require("../../../components/ui/card");
const button_1 = require("../../../components/ui/button");
const input_1 = require("../../../components/ui/input");
const table_1 = require("../../../components/ui/table");
const api_1 = require("../../../services/api");
const ProdutoSelect_1 = require("./ProdutoSelect");
const useProdutos_1 = require("../../../hooks/useProdutos");
const react_hook_form_1 = require("react-hook-form");
function DialogAlterVenda({ venda, setOpen, onVendaUpdated, }) {
    const { produtos } = (0, useProdutos_1.useProdutos)();
    const methods = (0, react_hook_form_1.useForm)({
        defaultValues: {
            data_venda: venda.data_venda.split("T")[0],
            desconto: venda.desconto ?? 0,
            itens: venda.itens.map((item) => ({
                produto_id: item.produto_id,
                produto_nome: item.produto_nome,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
                desconto: item.desconto,
            })),
        },
    });
    const { control, handleSubmit, watch, setValue } = methods;
    const { fields, append, remove } = (0, react_hook_form_1.useFieldArray)({ control, name: "itens" });
    const itens = watch("itens");
    const desconto = watch("desconto");
    const total = itens.reduce((acc, item) => acc + item.quantidade * item.preco_unitario, 0);
    const totalComDesconto = total - (total * desconto) / 100;
    const atualizarPrecoProduto = (index, produtoId) => {
        const prod = produtos.find((p) => p.id === Number(produtoId));
        if (!prod)
            return;
        setValue(`itens.${index}.produto_id`, prod.id ?? 0);
        setValue(`itens.${index}.preco_unitario`, prod.preco_venda ?? 0);
        setValue(`itens.${index}.produto_nome`, prod.nome);
    };
    const onSubmit = async (formData) => {
        try {
            const produtosApi = formData.itens.map((item) => ({
                produtoId: item.produto_id,
                quantidade: item.quantidade,
                precoUnitario: item.preco_unitario,
                desconto: item.desconto ?? 0,
            }));
            await (0, api_1.atualizarVenda)(venda.id, {
                clienteId: venda.cliente_id,
                dataVenda: formData.data_venda,
                desconto: formData.desconto,
                total,
                totalComDesconto,
                produtos: produtosApi,
            });
            if (onVendaUpdated)
                onVendaUpdated();
            setOpen(false);
            alert("Venda atualizada com sucesso!");
        }
        catch (error) {
            console.error("Erro ao atualizar venda:", error);
            alert("Erro ao atualizar venda");
        }
    };
    return (<react_hook_form_1.FormProvider {...methods}>
      <dialog_1.DialogContent style={{
            width: "900px",
            maxWidth: "none",
            height: "70vh",
            overflowY: "auto",
        }}>
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Editar Venda #{venda.id}</dialog_1.DialogTitle>
        </dialog_1.DialogHeader>

        <card_1.CardContent className="p-6 space-y-4">
          <div>
            <strong>Cliente:</strong>
            <input_1.Input value={venda.cliente_nome} disabled/>
          </div>

          <div>
            <strong>Data da Venda:</strong>
            <input_1.Input type="date" {...methods.register("data_venda")}/>
          </div>

          <div>
            <strong>Desconto (%):</strong>
            <input_1.Input type="number" {...methods.register("desconto")}/>
          </div>

          <div>
            <strong>Total:</strong> R${total.toFixed(2).replace(".", ",")}
          </div>
          <div>
            <strong>Total com Desconto:</strong> R$
            {totalComDesconto.toFixed(2).replace(".", ",")}
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <strong>Itens:</strong>
              <button_1.Button onClick={() => append({
            produto_id: 0,
            produto_nome: "",
            quantidade: 1,
            preco_unitario: 0,
            desconto: 0,
        })}>
                Adicionar Produto
              </button_1.Button>
            </div>

            <table_1.Table>
              <table_1.TableHeader>
                <table_1.TableRow>
                  <table_1.TableHead>Produto</table_1.TableHead>
                  <table_1.TableHead>Quantidade</table_1.TableHead>
                  <table_1.TableHead>Preço Unitário</table_1.TableHead>
                  <table_1.TableHead>Desconto (%)</table_1.TableHead>
                  <table_1.TableHead>Ações</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {fields.map((item, index) => (<table_1.TableRow key={item.id}>
                    <table_1.TableCell>
                      <ProdutoSelect_1.ProdutoSelect control={control} name={`itens.${index}.produto_id`} produtos={produtos} index={index} atualizarPrecoProduto={atualizarPrecoProduto}/>
                    </table_1.TableCell>

                    <table_1.TableCell>
                      <input_1.Input type="number" {...methods.register(`itens.${index}.quantidade`)}/>
                    </table_1.TableCell>

                    <table_1.TableCell>
                      <input_1.Input type="number" {...methods.register(`itens.${index}.preco_unitario`)}/>
                    </table_1.TableCell>

                    <table_1.TableCell>
                      <input_1.Input type="number" {...methods.register(`itens.${index}.desconto`)}/>
                    </table_1.TableCell>

                    <table_1.TableCell>
                      <button_1.Button variant="destructive" onClick={() => remove(index)}>
                        Remover
                      </button_1.Button>
                    </table_1.TableCell>
                  </table_1.TableRow>))}
              </table_1.TableBody>
            </table_1.Table>
          </div>

          <div className="pt-4 flex gap-2">
            <button_1.Button onClick={handleSubmit(onSubmit)} className="bg-green-500 text-primary-foreground font-medium px-8 h-11 shadow-soft cursor-pointer transition-colors duration-300 ease-in-out hover:bg-green-600 hover:shadow-md">
              Salvar
            </button_1.Button>

            <button_1.Button className="cursor-pointer" variant="secondary" onClick={() => setOpen(false)}>
              Fechar
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </dialog_1.DialogContent>
    </react_hook_form_1.FormProvider>);
}
