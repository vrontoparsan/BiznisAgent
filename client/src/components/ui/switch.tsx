import * as React from "react";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = "", label, id, checked, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            id={id}
            className="sr-only peer"
            checked={checked}
            {...props}
          />
          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 transition-colors relative">
            <div className={`absolute top-[2px] left-[2px] bg-background w-5 h-5 rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
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

Switch.displayName = "Switch";
