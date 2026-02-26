import * as React from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, id, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            id={id}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 border-2 border-input rounded peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-primary-foreground opacity-0 peer-checked:opacity-100" />
          </div>
        </label>
        {label && (
          <label htmlFor={id} className="text-sm cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
