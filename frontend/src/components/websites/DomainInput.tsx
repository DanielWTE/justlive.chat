'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DomainInputProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export function DomainInput({
  id = 'domain',
  name = 'domain',
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  error
}: DomainInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '') // Remove protocol and www
      .replace(/\/$/, ''); // Remove trailing slash
    
    onChange?.(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Domain</Label>
      <Input
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder="mystore.com"
        disabled={disabled}
        required={required}
        className={cn(
          "font-mono",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      <p className={cn(
        "text-sm",
        error ? "text-destructive" : "text-muted-foreground"
      )}>
        {error || "Enter your website's domain without http:// or https://"}
      </p>
    </div>
  );
} 