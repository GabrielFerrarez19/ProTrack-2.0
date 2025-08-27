import * as z from "zod";

// Agora os tipos correspondem aos valores que vêm do banco
export const vendaSchema = z.object({
  clienteId: z.string(),
  dataVenda: z.string(),
  desconto: z.number(),
  total: z.number().optional(),
  totalComDesconto: z.number().optional(),
  status: z.enum(["Pendente", "pago", "cancelado"]).optional(),
  formaPagamento: z
    .enum(["dinheiro", "cartao", "pix", "transferencia"])
    .optional(),
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
