import { Button } from "../../../components/ui/button";
import { Save, X } from "lucide-react";

interface FormActionsProps {
  handleCancel: () => void;
}

export default function FormActions({ handleCancel }: FormActionsProps) {
  return (
    <div className="flex gap-4 pt-4">
      <Button
        type="submit"
        className="flex-1 cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] hover:from-[#7A9BFD] hover:to-[#B597F9]"
      >
        <Save className="h-4 w-4 mr-2" />
        Salvar Conta
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        className="flex-1 cursor-pointer"
      >
        <X className="h-4 w-4 mr-2" />
        Cancelar
      </Button>
    </div>
  );
}
