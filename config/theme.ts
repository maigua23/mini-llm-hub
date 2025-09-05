import { createContext } from "react";

export const lightTheme = {
  bg: "#F8F9FA",
  cardBg: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#6C757D",
  border: "#E9ECEF",
  maroon: "#8B0000",
  shadow: "rgba(0,0,0,0.08)",
};

export const darkTheme = {
  bg: "#0F1724",
  cardBg: "#111827",
  text: "#FFFFFF",
  textSecondary: "#9CA3AF",
  border: "#1F2937",
  maroon: "#B91C1C",
  shadow: "rgba(255,255,255,0.04)",
};

export type ThemeType = typeof lightTheme;

export const ThemeContext = createContext({
  isDark: false,
  toggle: () => {},
  theme: {} as ThemeType,
});
