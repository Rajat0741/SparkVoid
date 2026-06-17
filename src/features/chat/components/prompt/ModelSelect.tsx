"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MODELS = [
  { value: "spark", label: "Spark", description: "Fast everyday answers" },
  { value: "void", label: "Void", description: "Search & scraping tools" },
];

interface ModelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {MODELS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              <div className="flex flex-col">
                <span className="font-medium">{m.label}</span>
                <span className="text-muted-foreground text-xs">
                  {m.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
