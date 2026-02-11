import { Button } from "@/components/ui/button";

interface CompanyRegistrationNavigationProps {
  step: number;
  canAdvance: boolean;
  loading?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function CompanyRegistrationNavigation({
  step,
  canAdvance,
  loading = false,
  onBack,
  onNext,
  onSubmit,
}: CompanyRegistrationNavigationProps) {
  return (
    <div className="flex justify-between pt-2">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 0 || loading}
      >
        Voltar
      </Button>
      {step < 2 ? (
        <Button onClick={onNext} disabled={!canAdvance || loading}>
          Próximo
        </Button>
      ) : (
        <Button onClick={onSubmit} disabled={!canAdvance || loading}>
          {loading ? "Cadastrando..." : "Cadastrar Empresa"}
        </Button>
      )}
    </div>
  );
}
