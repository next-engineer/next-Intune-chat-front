import type React from "react"
import { Button } from "@/commons/components/ui/button"
import { cn } from "@/commons/utils"
import { forwardRef } from "react"

interface IntuneButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export const IntuneButton = forwardRef<HTMLButtonElement, IntuneButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "rounded-intune font-medium transition-all duration-200 min-h-touch",
          {
            "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg": variant === "primary",
            "bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg": variant === "secondary",
            "border-2 border-primary text-primary hover:bg-primary hover:text-white": variant === "outline",
            "text-primary hover:bg-primary/10": variant === "ghost",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

IntuneButton.displayName = "IntuneButton"
