import { Header } from "../../components/header";
import { ClientForm } from "./components/ClientForm";

export function CacUsers() {
  return (
    <div className="p-4 md:p-8">
      <Header
        title="Bem vindo a página cadastro de clientes!"
        text="Aqui você pode cadastrar novos produtos no seu estoque"
      />
      <ClientForm />
    </div>
  );
}
