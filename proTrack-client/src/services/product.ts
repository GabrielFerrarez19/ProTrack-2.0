import type { ProductRequest, ProductResponse } from "@/@types/product";
import { api } from "./api";

interface ListProductResponse {
  products: ProductResponse[];
  count: number;
  percentage: number;
  cost_total: number;
}

export async function CreateProduct(
  data: ProductRequest,
): Promise<ProductResponse> {
  const response = await api.post<ProductResponse>("/product", data);
  return response.data;
}

export async function ListProduct(): Promise<ProductResponse[]> {
  const response = await api.get<ListProductResponse>("/product/company");
  return response.data.products;
}

export async function CountProduct(): Promise<number> {
  const response = await api.get<ListProductResponse>("/product/count");
  return response.data.count;
}

export async function PercentageProduct(): Promise<number> {
  const response = await api.get<ListProductResponse>("/product/percentage");
  return response.data.percentage;
}

export async function GetCostTotalStock(): Promise<number> {
  const response = await api.get<ListProductResponse>("/product/cost-total");
  return response.data.cost_total;
}
