import { IoIosFlash } from "react-icons/io";
import { GiBlackHoleBolas } from "react-icons/gi";
import type { ModelId } from "../validators";

export interface ModelConfig {
  value: ModelId;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export const MODEL_CONFIGS: Record<ModelId, ModelConfig> = {
  spark: {
    value: "spark",
    label: "Spark",
    description: "Fast everyday answers",
    icon: <IoIosFlash className="size-5" color="#ffd000" />,
  },
  void: {
    value: "void",
    label: "Void",
    description: "Search & scraping tools",
    icon: <GiBlackHoleBolas className="size-5" color="#8b5cf6" />,
  },
};
