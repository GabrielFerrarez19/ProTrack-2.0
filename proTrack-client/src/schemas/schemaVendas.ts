import * as z from "zod";

export const vendaSchema = z.object({
  clienteId: z.string(),
  dataVenda: z.string(),
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
