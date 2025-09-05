import { LLM } from "../types";

export const LLMS: LLM[] = [
  {
    id: "llama-3.1-8b-instant",
    name: "LLaMA 3.1 (8B Instant)",
    icon: { lib: "Ionicons", name: "flash-outline" },
    description: "Fast, low-latency model from Meta's LLaMA 3 family. Great for chat, reasoning, and coding tasks.",
    colorStart: "#3498DB",
    colorEnd: "#66B2FF",
    status: "active",
  },
  {
    id: "gpt4",
    name: "GPT-4",
    icon: { lib: "MaterialCommunityIcons", name: "brain" },
    description: "Advanced reasoning for complex problems, analysis, and creative writing.",
    colorStart: "#4ECDC4",
    colorEnd: "#7EE7D8",
    status: "coming-soon",
  },
  {
    id: "phi3",
    name: "Phi-3",
    icon: { lib: "MaterialCommunityIcons", name: "star-four-points" },
    description: "Compact model optimized for mobile, great for quick tasks and learning.",
    colorStart: "#9B59B6",
    colorEnd: "#C78CE2",
    status: "coming-soon",
  },
  {
    id: "mistral",
    name: "Mistral",
    icon: { lib: "MaterialCommunityIcons", name: "robot-outline" },
    description: "Fast and efficient for general conversations, coding help, and quick answers.",
    colorStart: "#FF6B35",
    colorEnd: "#FF9A7B",
    status: "coming-soon",
  },
];
