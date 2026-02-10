import { Button } from "@/components/ui/button";

interface CompanyRegistrationNavigationProps {
  step: number;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function CompanyRegistrationNavigation({
  step,
  canAdvance,
  onBack,
  onNext,
  onSubmit,
}: CompanyRegistrationNavigationProps) {
  return (
    <div className="flex justify-between pt-2">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 0}
      >
        Voltar
      </Button>
      {step < 2 ? (
        <Button onClick={onNext} disabled={!canAdvance}>
          Próximo
        </Button>
      ) : (
        <Button onClick={onSubmit} disabled={!canAdvance}>
          Cadastrar Empresa
        </Button>
      )}
    </div>
  );
}
