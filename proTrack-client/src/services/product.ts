import type { ProductRequest, ProductResponse } from "@/@types/product";
import { api } from "./api";

export async function CreateProduct(
  data: ProductRequest,
): Promise<ProductResponse> {
  const response = await api.post<ProductResponse>("/product", data);
  return response.data;
}
