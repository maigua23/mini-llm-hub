import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LLMCard } from "../../components/LLMCard";
import { LLMIcon } from "../../components/LLMIcon";
import { LLMS } from "../../config/llm";
import { ThemeContext } from "../../config/theme";
import { LLM } from "../../types";

console.log("DEBUG LLMCard:", LLMCard);
console.log("DEBUG LLMS:", LLMS);

export default function HomeScreen({ navigation }: any) {
  const { isDark, toggle, theme } = useContext(ThemeContext);
  const [showInfo, setShowInfo] = useState(false);
  const [infoLLM, setInfoLLM] = useState<LLM | null>(null);

  const openLLM = (llm: LLM) => {
    if (llm.status === "coming-soon") {
      setInfoLLM(llm);
      setShowInfo(true);
      return;
    }
    navigation.navigate("Chat", { llmId: llm.id });
  };

  const showLLMInfo = (llm: LLM) => {
    setInfoLLM(llm);
    setShowInfo(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerText, { color: theme.text }]}>JUST ASK</Text>
            <Text style={[styles.headerSubtext, { color: theme.textSecondary }]}>Choose your AI assistant</Text>
          </View>

          <Pressable
            style={[styles.themeButton, { backgroundColor: theme.maroon }]}
            onPress={toggle}
            android_ripple={{ color: "#00000022" }}
          >
            <Ionicons name={isDark ? "sunny-outline" : "moon"} size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        {LLMS.map((llm) => (
          <LLMCard
            key={llm.id}
            llm={llm}
            onPress={() => openLLM(llm)}
            onInfo={() => showLLMInfo(llm)}
          />
        ))}
      </ScrollView>

      {/* Info Modal */}
      <Modal visible={showInfo} transparent animationType="fade" onRequestClose={() => setShowInfo(false)}>
        <View style={styles.modal}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            {infoLLM && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalIcon, { backgroundColor: infoLLM.colorStart }]}>
                    <LLMIcon icon={infoLLM.icon} size={22} />
                  </View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>{infoLLM.name}</Text>
                </View>

                <Text style={[styles.modalDescription, { color: theme.textSecondary }]}>
                  {infoLLM.description}
                </Text>

                {infoLLM.status === "coming-soon" && (
                  <View style={styles.modalAlert}>
                    <Text style={styles.modalAlertText}>This LLM is coming soon — stay tuned!</Text>
                  </View>
                )}

                <Pressable
                  style={[styles.modalButton, { backgroundColor: theme.maroon }]}
                  onPress={() => setShowInfo(false)}
                  android_ripple={{ color: "#ffffff22" }}
                >
                  <Text style={styles.modalButtonText}>Got it</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    shadowColor: "#00000010",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#00000020",
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    minWidth: 300,
    shadowColor: "#00000033",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  modalDescription: {
    fontSize: 15,
    marginBottom: 12,
  },
  modalAlert: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  modalAlertText: {
    color: "#F57F17",
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
