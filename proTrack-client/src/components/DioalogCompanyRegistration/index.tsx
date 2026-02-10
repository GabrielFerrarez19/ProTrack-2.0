import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { CompanyData } from "./types";
import { initialCompanyData } from "./types";
import { CompanyRegistrationStepper } from "./CompanyRegistrationStepper";
import { StepCompanyData } from "./StepCompanyData";
import { StepContact } from "./StepContact";
import { StepAddress } from "./StepAddress";
import { CompanyRegistrationNavigation } from "./CompanyRegistrationNavigation";

export type { CompanyData } from "./types";

interface CompanyRegistrationModalProps {
  open: boolean;
  onComplete: (data: CompanyData) => void;
}

function canAdvance(step: number, data: CompanyData): boolean {
  if (step === 0)
    return data.name.trim() !== "" && data.document.trim() !== "" && !!data.document_type;
  if (step === 1) return data.email.trim() !== "" && data.phone.trim() !== "";
  if (step === 2)
    return (
      data.address_street.trim() !== "" &&
      data.address_city.trim() !== "" &&
      data.address_state.trim() !== "" &&
      data.address_zipcode.trim() !== ""
    );
  return false;
}

export function CompanyRegistrationModal({
  open,
  onComplete,
}: CompanyRegistrationModalProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CompanyData>(initialCompanyData);

  const update = (field: keyof CompanyData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    onComplete(data);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[560px] [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Cadastro da Empresa</DialogTitle>
          <DialogDescription>
            Configure os dados da sua empresa para começar a usar o sistema.
          </DialogDescription>
        </DialogHeader>

        <CompanyRegistrationStepper currentStep={step} />

        {step === 0 && <StepCompanyData data={data} onUpdate={update} />}
        {step === 1 && <StepContact data={data} onUpdate={update} />}
        {step === 2 && <StepAddress data={data} onUpdate={update} />}

        <CompanyRegistrationNavigation
          step={step}
          canAdvance={canAdvance(step, data)}
          onBack={() => setStep((s) => s - 1)}
          onNext={() => setStep((s) => s + 1)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
