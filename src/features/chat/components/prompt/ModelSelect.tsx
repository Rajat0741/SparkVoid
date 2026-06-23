"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODEL_CONFIGS } from "@/features/chat/models/model-config";
import type { ModelId } from "@/features/chat/validators";

interface ModelSelectProps {
  value: ModelId;
  onChange: (value: ModelId) => void;
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  const selected = MODEL_CONFIGS[value];

  const handleChange = (next: ModelId | null) => {
    if (next !== null) onChange(next);
  };

  return (
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="border-2">
          {selected?.icon}
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent align="start" side="bottom" alignItemWithTrigger={false} >
            {Object.values(MODEL_CONFIGS).map((m) => (
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
