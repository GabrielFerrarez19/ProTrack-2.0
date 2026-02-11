import type { ProductCategoryResponse } from "@/@types/product_categories";
import { api } from "./api";

interface GetCategoriesResponse {
  categories: ProductCategoryResponse[];
}

interface CreateCategoryPayload {
  name: string;
  color: string;
}

interface UpdateCategoryPayload {
  name?: string;
  color?: string;
}

export async function getProductCategories(): Promise<
  ProductCategoryResponse[]
> {
  const response = await api.get<GetCategoriesResponse>(
    "/products-categories/list/company",
  );
  return response.data.categories ?? [];
}

export async function createProductCategory(
  data: CreateCategoryPayload,
): Promise<ProductCategoryResponse> {
  const response = await api.post<{ category: ProductCategoryResponse }>(
    "/products-categories",
    data,
  );
  return response.data.category;
}

export async function updateProductCategory(
  id: string,
  data: UpdateCategoryPayload,
): Promise<ProductCategoryResponse> {
  const response = await api.put<{ category: ProductCategoryResponse }>(
    `/products-categories/${id}`,
    data,
  );
  return response.data.category;
}

export async function deleteProductCategory(id: string): Promise<void> {
  await api.delete(`/products-categories/${id}`);
}
