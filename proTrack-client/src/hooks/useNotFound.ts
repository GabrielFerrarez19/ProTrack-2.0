import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useNotFound = () => {
  const navigate = useNavigate();

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const goToPage = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  return {
    goHome,
    goBack,
    goToDashboard,
    goToPage,
  };
};
