import { CompanyRegistrationModal } from "@/components/DioalogCompanyRegistration";
import { Header } from "../../components/header";
import { CardsClientes } from "./CardsClientes";
import { CardsStatus } from "./CardsStatus";
import { TableData } from "./TabelaDados";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useStatus } from "@/hooks/useStatus";

export function Status() {
  const { hasCompany, setHasCompany } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const { dados, loading, error } = useStatus();

  useEffect(() => {
    if (!hasCompany) {
      setOpenModal(true);
    }
  }, [hasCompany]);

  const handleRegistrationComplete = () => {
    setHasCompany(true);
    localStorage.setItem("has_company", "true");
    setOpenModal(false);
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <Header
        title="Bem vindo a página Status!"
        text="Aqui você pode acompanhar alguns dados da sua empresa"
      />
      {/* Stats Cards */}

      <CardsStatus dados={dados} loading={loading} error={error} />

      {/* People Cards */}
      <CardsClientes />
      {/* Table */}
      <TableData />

      <CompanyRegistrationModal
        open={openModal}
        onComplete={handleRegistrationComplete}
      />
    </div>
  );
}
