import { Header } from "../../components/header";
import { ProductForm } from "./components/ProductForm";

export function CadProduct() {
  return (
    <div className="p-4 md:p-8">
      <Header
        title="Bem vindo a página cadastro de clientes!"
        text="Aqui você pode cadastrar novos produtos no seu estoque"
      />
      <ProductForm />
    </div>
  );
}
