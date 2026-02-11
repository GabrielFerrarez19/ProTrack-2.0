import type { ProductCategoryResponse } from "@/@types/product_categories";
import { api } from "./api";

interface GetCategoriesResponse {
  categories: ProductCategoryResponse[];
}

export async function getProductCategories(): Promise<
  ProductCategoryResponse[]
> {
  const response = await api.get<GetCategoriesResponse>(
    "/products-categories/list/company",
  );
  return response.data.categories ?? [];
}
