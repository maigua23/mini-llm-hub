import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { LLMIconDef } from "../types";

interface LLMIconProps {
  icon: LLMIconDef;
  size?: number;
  color?: string;
}

export const LLMIcon: React.FC<LLMIconProps> = ({
  icon,
  size = 22,
  color = "#fff",
}) => {
  if (icon.lib === "Ionicons") {
    return <Ionicons name={icon.name as any} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={icon.name as any} size={size} color={color} />;
};
