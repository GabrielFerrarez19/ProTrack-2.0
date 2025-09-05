import { useState } from "react";
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

export function CadastroContasPagar() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fornecedor_nome: "",
    valor: "",
    data_vencimento: "",
    status: "pendente",
    categoria_id: "",
    descricao: "",
    data_agendamento: "",
    valor_pago: "",
    forma_pagamento: "",
    observacoes: "",
  });

  const categorias = [
    "Mercadoria",
    "Utilidades",
    "Tecnologia",
    "Financeiro",
    "Outros",
  ];
  const statusOptions = ["pendente", "pago", "vencido", "agendado"];
  const formasPagamento = [
    "Dinheiro",
    "PIX",
    "Cartão de Débito",
    "Cartão de Crédito",
    "Transferência",
    "Boleto",
    "Cheque",
  ];

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
                statusOptions={statusOptions}
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
