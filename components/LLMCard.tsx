import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemeContext } from "../config/theme";
import { LLM } from "../types";
import { LLMIcon } from "./LLMIcon";

interface LLMCardProps {
  llm: LLM;
  onPress: () => void;
  onInfo: () => void;
}

export const LLMCard: React.FC<LLMCardProps> = ({ llm, onPress, onInfo }) => {
  const { theme } = useContext(ThemeContext);
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      android_ripple={{ color: "#00000008" }}
      style={({ pressed }) => [
        styles.llmCard,
        { backgroundColor: theme.cardBg, opacity: pressed ? 0.98 : 1, borderColor: theme.border }
      ]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.llmCardRow}>
          <LinearGradient colors={[llm.colorStart, llm.colorEnd]} start={[0, 0]} end={[1, 1]} style={styles.llmIcon}>
            <LLMIcon icon={llm.icon} size={26} />
          </LinearGradient>

          <View style={styles.llmInfo}>
            <View style={styles.llmHeader}>
              <Text style={[styles.llmName, { color: theme.text }]}>{llm.name}</Text>

              <View style={styles.llmActions}>
                <View style={[styles.statusBadge, { backgroundColor: llm.status === "active" ? "#E8F5E8" : "#FFF3CD" }]}>
                  <Text style={[styles.statusText, { color: llm.status === "active" ? "#2E7D32" : "#F57F17" }]}>
                    {llm.status === "active" ? "Active" : "Soon"}
                  </Text>
                </View>

                <Pressable onPress={onInfo} style={[styles.infoButton]} android_ripple={{ color: "#00000022" }}>
                  <Ionicons name="information-circle-outline" size={18} color={theme.textSecondary} />
                </Pressable>
              </View>
            </View>

            <Text style={[styles.llmDescription, { color: theme.textSecondary }]} numberOfLines={2}>
              {llm.description}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  llmCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#00000012",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  llmCardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  llmIcon: {
    width: 64,
    height: 64,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    shadowColor: "#00000022",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  llmInfo: {
    flex: 1,
  },
  llmHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  llmName: {
    fontSize: 18,
    fontWeight: "800",
  },
  llmActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  llmDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});