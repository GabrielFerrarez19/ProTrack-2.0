import z from "zod";

const perfilSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  username: z.string().min(3).optional(),
  role: z.string(),
  departamento_id: z.string().optional(),
});
type PerfilFormData = z.infer<typeof perfilSchema>;

export { perfilSchema, type PerfilFormData };
