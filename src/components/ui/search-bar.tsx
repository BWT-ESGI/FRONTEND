import * as React from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  icon?: boolean;
  inputClassName?: string;
}

export function SearchBar({ placeholder = "Rechercher...", icon=true, inputClassName, ...props }: SearchBarProps) {
  return (
    <div className="relative w-full">
        {icon && (<SearchIcon className="absolute inset-y-0 left-2 my-auto h-4 w-4 text-muted-foreground" />)}
      <Input 
        type="search" 
        placeholder={placeholder} 
        className={`w-full pl-8 ${inputClassName}`}
        {...props} 
      />
    </div>
  );
}