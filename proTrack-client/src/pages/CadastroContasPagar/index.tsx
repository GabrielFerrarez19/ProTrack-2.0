import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import FormContasPagar from "./components/FormContasPagar";
import FormActions from "./components/FormActions";
import type { ContasPagarFormData } from "../../@types/types.components";
import { Header } from "../../components/header";
import { useContasPagar } from "../../hooks/useContasPagar";
import { listBillCategories } from "../../services/billCategories";
import { ListPaymentMethodsIsActive } from "../../services/paymentMethods";

export function CadastroContasPagar() {
  const navigate = useNavigate();
  const { criarConta } = useContasPagar();

  const [formData, setFormData] = useState({
    fornecedor_nome: "",
    valor: "",
    data_vencimento: "",
    status: "pendente",
    categoria_id: "",
    descricao: "",
    valor_pago: "",
    forma_pagamento: "",
    observacoes: "",
  });

  const [categorias, setCategorias] = useState<
    { id: string; nome: string }[]
  >([]);
  const [formasPagamento, setFormasPagamento] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    async function loadAuxiliares() {
      try {
        const [billCats, paymentMethods] = await Promise.all([
          listBillCategories(),
          ListPaymentMethodsIsActive(),
        ]);

        setCategorias(
          billCats.map((c) => ({
            id: c.id,
            nome: c.name,
          })),
        );

        setFormasPagamento(
          paymentMethods.map((m) => ({
            id: m.id,
            name: m.name,
          })),
        );
      } catch (e) {
        console.error(e);
      }
    }

    loadAuxiliares();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fornecedor_nome ||
      !formData.valor ||
      !formData.data_vencimento ||
      !formData.categoria_id
    ) {
      return;
    }
    // Por enquanto o fornecedor ainda é apenas nome; o hook validar�
    // que é necessário um fornecedor_id real para integrar completamente.
    criarConta({
      fornecedor_nome: formData.fornecedor_nome,
      valor: Number(formData.valor),
      data_vencimento: formData.data_vencimento,
      categoria_id: formData.categoria_id,
      descricao: formData.descricao,
      forma_pagamento: formData.forma_pagamento,
      observacoes: formData.observacoes,
    });
    navigate("/contasPagar");
  };

  const handleCancel = () => {
    navigate("/contasPagar");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-7xl p-6 space-y-6">
        <Header
          title="Cadastro de Contas a Pagar"
          text="Cadastre uma nova conta a pagar"
        />
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormContasPagar
                formData={formData as ContasPagarFormData}
                handleInputChange={handleInputChange}
                categorias={categorias}
                formasPagamento={formasPagamento}
              />
              <FormActions handleCancel={handleCancel} />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
