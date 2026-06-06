import type { CreateInstance, WhatsAppResponse } from "@/@types/whatsapp";
import { api } from "./api";

export async function createInstance(): Promise<CreateInstance> {
  const response = await api.post<CreateInstance>("/whatsapp/instance/create");
  return response.data;
}
