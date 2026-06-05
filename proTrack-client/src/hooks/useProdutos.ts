import { ListProduct } from "@/services/product";
import { useQuery } from "@tanstack/react-query";

export function useProdutos() {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: () => ListProduct(), // ← chama o serviço direto, sem hooks
    staleTime: 5 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}
