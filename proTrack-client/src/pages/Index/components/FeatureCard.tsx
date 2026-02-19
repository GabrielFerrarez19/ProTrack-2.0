import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import type { ComponentType } from "react";

export interface FeatureCardProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  items: string[];
  progress: number;
  progressLabel: string;
  iconWrapperClassName?: string;
  iconColorClassName?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  items,
  progress,
  progressLabel,
  iconWrapperClassName = "from-primary to-primary/80",
  iconColorClassName = "text-primary-foreground",
}: FeatureCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20 hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div
          className={`w-14 h-14 bg-gradient-to-br ${iconWrapperClassName} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-7 h-7 ${iconColorClassName}`} />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item} className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-xs text-muted-foreground mt-1">{progressLabel}</div>
      </CardContent>
    </Card>
  );
}
