import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/30",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm shadow-destructive/30",
        outline: "text-foreground border-border",
        critical:
          "border-transparent bg-destructive/20 text-destructive border border-destructive/30 animate-pulse",
        high:
          "border-transparent bg-orange-500/20 text-orange-400 border border-orange-500/30",
        medium:
          "border-transparent bg-warning/20 text-warning border border-warning/30",
        low:
          "border-transparent bg-primary/20 text-primary border border-primary/30",
        info:
          "border-transparent bg-blue-500/20 text-blue-400 border border-blue-500/30",
        success:
          "border-transparent bg-success/20 text-success border border-success/30",
        active:
          "border-transparent bg-destructive/20 text-destructive border border-destructive/30 animate-threat-pulse",
        mitigated:
          "border-transparent bg-success/20 text-success border border-success/30",
        investigating:
          "border-transparent bg-warning/20 text-warning border border-warning/30",
        resolved:
          "border-transparent bg-muted text-muted-foreground border border-border",
        online:
          "border-transparent bg-success/20 text-success border border-success/30",
        offline:
          "border-transparent bg-muted text-muted-foreground border border-border",
        compromised:
          "border-transparent bg-destructive/20 text-destructive border border-destructive/30 animate-pulse",
        isolated:
          "border-transparent bg-warning/20 text-warning border border-warning/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
