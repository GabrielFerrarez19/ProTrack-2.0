import type { PaymentMethodResponse } from "@/@types/paymentMethods";
import { GetPaymentMethods } from "@/services/paymentMethods";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPaymentMethods = useCallback(async () => {
    const controller = new AbortController(); // 👈
    try {
      setLoading(true);
      const paymentMethods = await GetPaymentMethods(controller.signal); // 👈
      setPaymentMethods(paymentMethods);
    } catch (err) {
      if (axios.isCancel(err)) return; // 👈 ignora cancelamentos
      setPaymentMethods([]);
      setError("Erro ao buscar métodos de pagamento");
    } finally {
      setLoading(false);
    }

    return () => controller.abort(); // 👈 cancela se desmontar
  }, []);

  useEffect(() => {
    const cancel = loadPaymentMethods();
    return () => {
      cancel?.then((fn) => fn?.());
    };
  }, [loadPaymentMethods]);

  return { paymentMethods, loading, error, reload: loadPaymentMethods };
};
