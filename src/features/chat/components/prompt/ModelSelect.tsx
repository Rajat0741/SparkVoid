"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SparklesIcon, GlobeIcon } from "lucide-react";
import type { ModelId } from "@/features/chat/validators";

const MODELS: {
  value: ModelId;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "spark",
    label: "Spark",
    description: "Fast everyday answers",
    icon: <SparklesIcon className="size-3.5" />,
  },
  {
    value: "void",
    label: "Void",
    description: "Search & scraping tools",
    icon: <GlobeIcon className="size-3.5" />,
  },
];

interface ModelSelectProps {
  value: ModelId;
  onChange: (value: ModelId) => void;
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  const selected = MODELS.find((m) => m.value === value);

  const handleChange = (next: ModelId | null) => {
    if (next !== null) onChange(next);
  };

  return (
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="border-0">
          {selected?.icon}
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent align="start" side="bottom" alignItemWithTrigger={false} >
            {MODELS.map((m) => (
              <SelectItem key={m.value} value={m.value} className="min-w-full p-3 pr-10">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5">{m.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight">{m.label}</span>
                    <span className="text-muted-foreground text-xs leading-tight">
                      {m.description}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
  );
}
