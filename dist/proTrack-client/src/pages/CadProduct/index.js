"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CadProduct = CadProduct;
const header_1 = require("../../components/header");
const ProductForm_1 = require("./components/ProductForm");
function CadProduct() {
    return (<div className="p-4 md:p-8">
      <header_1.Header title="Bem vindo a página cadastro de produtos!" text="Aqui você pode cadastrar novos produtos no seu estoque"/>
      <ProductForm_1.ProductForm />
    </div>);
}
