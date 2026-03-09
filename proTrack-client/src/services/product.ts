import type {
  ProductRequest,
  ProductResponse,
  Top5Products,
} from "@/@types/product";
import { api } from "./api";

interface ProductResponseApi {
  products: ProductResponse[];
  count: number;
  percentage: number;
  cost_total: number;
  top_products: Top5Products[];
}

export async function CreateProduct(
  data: ProductRequest,
): Promise<ProductResponse> {
  const response = await api.post<ProductResponse>("/product", data);
  return response.data;
}

export async function ListProduct(): Promise<ProductResponse[]> {
  const response = await api.get<ProductResponseApi>("/product/company");
  return response.data.products;
}

export async function CountProduct(): Promise<number> {
  const response = await api.get<ProductResponseApi>("/product/count");
  return response.data.count;
}

export async function PercentageProduct(): Promise<number> {
  const response = await api.get<ProductResponseApi>("/product/percentage");
  return response.data.percentage;
}

export async function GetCostTotalStock(): Promise<number> {
  const response = await api.get<ProductResponseApi>("/product/cost-total");
  return response.data.cost_total;
}

export async function GetTopProducts(): Promise<Top5Products[]> {
  const response = await api.get<ProductResponseApi>("/product/top-products");
  return response.data.top_products;
}
