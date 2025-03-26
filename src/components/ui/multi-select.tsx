"use client";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { type Dispatch, forwardRef, type SetStateAction, useCallback, useRef, useState } from "react";

export type Option = {
    value: string;
    label: string;
};

interface MultiSelectProps {
    options: Option[];
    placeholder?: string;
    defaultSelected?: Option[];
    setParentSelected?: Dispatch<SetStateAction<Option[]>>
    onChange?: (value: Option[]) => void;
    maxSelected?: number;
}

export function MultiSelect({
                                options = [],
                                placeholder = `Sélectionner plusieurs...`,
                                defaultSelected = [],
                                setParentSelected,
                                onChange,
                                maxSelected
                            }: MultiSelectProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Option[]>(options.filter(option => defaultSelected.some(s => s.value === option.value)));
    const [inputValue, setInputValue] = useState("");
    
    const handleUnselect = useCallback((option: Option) => {
        const newSelected = selected.filter(s => s.value !== option.value);
        
        setSelected(newSelected);
        
        if (setParentSelected) {
            setParentSelected(newSelected);
        }
        
        if (onChange) {
            onChange(newSelected);
        }
    }, [selected, setParentSelected, onChange]);
    
    const handleSelect = useCallback((option: Option) => {
        if (!maxSelected || selected.length < maxSelected) {
            const newSelected = [...selected, option];
            
            setSelected(newSelected);
            setInputValue("");
            
            if (setParentSelected) {
                setParentSelected(newSelected);
            }
            
            if (onChange) {
                onChange(newSelected);
            }
        }
    }, [selected, maxSelected, setParentSelected, onChange]);
    
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "") {
                    const newSelected = selected.slice(0, -1);
                    
                    setSelected(newSelected);
                    
                    if (setParentSelected) {
                        setParentSelected(newSelected);
                    }
                    
                    if (onChange) {
                        onChange(newSelected);
                    }
                }
            }
            if (e.key === "Escape") {
                input.blur();
            }
        }
    }, [selected, setParentSelected, onChange]);
    
    const selectables = Array.isArray(options)
        ? options.filter(option => !selected.some(s => s.value === option.value))
        : [];
    
    return (
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
            <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex gap-1 flex-wrap">
                    {selected.map((option) => (
                        <Badge key={option.value} variant="secondary">
                            {option.label}
                            <button
                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUnselect(option);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(option)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground"/>
                            </button>
                        </Badge>
                    ))}
                    <ForwardedInput
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && selectables.length > 0 ? (
                        <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-fit max-h-[200px] overflow-auto">
                                {selectables.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => handleSelect(option)}
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}

const ForwardedInput = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>>((props, ref) => (
    <CommandPrimitive.Input {...props} ref={ref}/>
));
ForwardedInput.displayName = "ForwardedInput";