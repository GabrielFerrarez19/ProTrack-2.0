import { ListCustomers } from "@/services/customers";
import { useQuery } from "@tanstack/react-query";

export function useClientes() {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: () => ListCustomers(),
    staleTime: 5 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}
