import * as z from "zod";

export const vendaSchema = z.object({
  clienteId: z.string(),
  dataVenda: z.string(),
  desconto: z.number(),
  total: z.number().optional(),
  totalComDesconto: z.number().optional(),
  status: z.enum(["Pendente", "pago", "cancelado"]).optional(), // novo campo
  formaPagamento: z.enum([
    "Dinheiro",
    "Cartão de Crédito",
    "Cartão de Débito",
    "Pix",
  ]),
  produtos: z.array(
    z.object({
      produtoId: z.string(),
      quantidade: z.number(),
      precoUnitario: z.number(),
      desconto: z.number(),
    })
  ),
});

export type VendaForm = z.infer<typeof vendaSchema>;
