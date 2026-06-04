import { ListProduct } from "@/services/product";
import { useQuery } from "@tanstack/react-query";

export function useProdutos() {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: () => ListProduct(), // ← chama o serviço direto, sem hooks
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}
