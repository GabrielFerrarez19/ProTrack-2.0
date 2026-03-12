import { RefreshCw } from "lucide-react";

interface PageLoadingProps {
  message?: string;
  fullHeight?: boolean;
}

export function PageLoading({
  message = "Carregando...",
  fullHeight = true,
}: PageLoadingProps) {
  return (
    <div
      className={`flex justify-center items-center ${
        fullHeight ? "min-h-[50vh]" : "py-8"
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
}

