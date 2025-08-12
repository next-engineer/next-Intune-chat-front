import type React from "react"
import { Input } from "@/commons/components/ui/input"
import { Label } from "@/commons/components/ui/label"
import { cn } from "@/commons/utils"
import { forwardRef } from "react"

interface IntuneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  required?: boolean
}

export const IntuneInput = forwardRef<HTMLInputElement, IntuneInputProps>(
  ({ className, label, error, success, required, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label className="text-sm font-medium text-gray-900">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          className={cn(
            "rounded-intune min-h-touch border-gray-300 focus:border-primary focus:ring-primary/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            success && "border-success focus:border-success focus:ring-success/20",
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        {success && <p className="text-sm text-success">{success}</p>}
      </div>
    )
  },
)

IntuneInput.displayName = "IntuneInput"
