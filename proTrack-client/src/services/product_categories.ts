import type { ProductCategoryResponse } from "@/@types/product_categories";
import { api } from "./api";

interface GetCategoriesResponse {
  categories: ProductCategoryResponse[];
}

export async function getProductCategories(): Promise<
  ProductCategoryResponse[]
> {
  const response = await api.get<GetCategoriesResponse>(
    "/products-categories/list/company/fa03ef88-9549-4948-9a97-11abecfbd8e2",
  );
  return response.data.categories;
}
