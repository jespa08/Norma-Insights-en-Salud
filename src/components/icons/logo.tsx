import { BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BookMarked className="h-8 w-8 text-primary" />
      <div className="flex items-baseline">
        <span className="font-headline font-bold text-2xl text-primary">
          Norma
        </span>
        <span className="font-headline font-normal text-2xl text-foreground ml-1.5">
          Insights
        </span>
      </div>
    </div>
  );
}
