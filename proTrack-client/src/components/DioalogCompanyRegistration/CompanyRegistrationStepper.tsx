import { Building2, MapPin, Contact } from "lucide-react";

export interface StepConfig {
  title: string;
  icon: typeof Building2;
}

const steps: StepConfig[] = [
  { title: "Dados da Empresa", icon: Building2 },
  { title: "Contato", icon: Contact },
  { title: "Endereço", icon: MapPin },
];

interface CompanyRegistrationStepperProps {
  currentStep: number;
}

export function CompanyRegistrationStepper({
  currentStep,
}: CompanyRegistrationStepperProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isDone
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}
            >
              {s.title}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-px flex-1 ${isDone ? "bg-primary/40" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
