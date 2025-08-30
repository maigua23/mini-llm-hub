// App.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { createContext, JSX, useContext, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// -------------------- Types --------------------
type ScreenParamList = {
  MainTabs: undefined;
  Chat: { llmId: string };
};

interface LLMIconDef {
  lib: "Ionicons" | "MaterialCommunityIcons";
  name: string;
}

interface LLM {
  id: string;
  name: string;
  icon: LLMIconDef;
  description: string;
  colorStart: string;
  colorEnd: string;
  status: "active" | "coming-soon";
}

// -------------------- Theme Context --------------------
type ThemeType = typeof lightTheme;
const ThemeContext = createContext({
  isDark: false,
  toggle: () => {},
  theme: {} as ThemeType,
});

// -------------------- Themes --------------------
const lightTheme = {
  bg: "#F8F9FA",
  cardBg: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#6C757D",
  border: "#E9ECEF",
  maroon: "#8B0000",
  shadow: "rgba(0,0,0,0.08)",
};

const darkTheme = {
  bg: "#0F1724",
  cardBg: "#111827",
  text: "#FFFFFF",
  textSecondary: "#9CA3AF",
  border: "#1F2937",
  maroon: "#B91C1C",
  shadow: "rgba(255,255,255,0.04)",
};

// -------------------- LLMs --------------------
const LLMS: LLM[] = [
  {
    id: "mistral",
    name: "Mistral",
    icon: { lib: "Ionicons", name: "flash-outline" }, // ⚡
    description:
      "Fast and efficient for general conversations, coding help, and quick answers.",
    colorStart: "#FF6B35",
    colorEnd: "#FF9A7B",
    status: "active",
  },
  {
    id: "gpt4",
    name: "GPT-4",
    icon: { lib: "MaterialCommunityIcons", name: "brain" }, // 🧠
    description:
      "Advanced reasoning for complex problems, analysis, and creative writing.",
    colorStart: "#4ECDC4",
    colorEnd: "#7EE7D8",
    status: "coming-soon",
  },
  {
    id: "phi3",
    name: "Phi-3",
    icon: { lib: "MaterialCommunityIcons", name: "star-four-points" }, // ✨
    description:
      "Compact model optimized for mobile, great for quick tasks and learning.",
    colorStart: "#9B59B6",
    colorEnd: "#C78CE2",
    status: "coming-soon",
  },
  {
    id: "llama",
    name: "Llama",
    icon: { lib: "MaterialCommunityIcons", name: "robot-outline" }, // 🤖
    description: "Open-source powerhouse for detailed explanations and research.",
    colorStart: "#3498DB",
    colorEnd: "#66B2FF",
    status: "coming-soon",
  },
];

// -------------------- Helper Icon Component --------------------
const LLMIcon: React.FC<{ icon: LLMIconDef; size?: number; color?: string }> = ({
  icon,
  size = 22,
  color = "#fff",
}) => {
  if (icon.lib === "Ionicons") {
    return <Ionicons name={icon.name as any} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={icon.name as any} size={size} color={color} />;
};

// -------------------- Main App --------------------
const Stack = createNativeStackNavigator<ScreenParamList>();
const Tabs = createBottomTabNavigator();

export default function App(): JSX.Element {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggle = () => setIsDark((s) => !s);

  return (
    <ThemeContext.Provider value={{ isDark, toggle, theme }}>
      <NavigationIndependentTree>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationIndependentTree>
    </ThemeContext.Provider>
  );
}

// -------------------- Tabs (Home + Settings) --------------------
function MainTabs() {
  const { theme } = useContext(ThemeContext);
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: theme.cardBg,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarIcon: ({ color, size }) => {
          // default icon (handled per route below)
          return null;
        },
      })}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

// -------------------- Home Screen --------------------
function HomeScreen({ navigation }: any) {
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

                <Text style={[styles.modalDescription, { color: theme.textSecondary }]}>{infoLLM.description}</Text>

                {infoLLM.status === "coming-soon" && (
                  <View style={styles.modalAlert}>
                    <Text style={styles.modalAlertText}>This LLM is coming soon — stay tuned!</Text>
                  </View>
                )}

                <Pressable style={[styles.modalButton, { backgroundColor: theme.maroon }]} onPress={() => setShowInfo(false)} android_ripple={{ color: "#ffffff22" }}>
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

// -------------------- LLM Card Component --------------------
const LLMCard: React.FC<{ llm: LLM; onPress: () => void; onInfo: () => void }> = ({ llm, onPress, onInfo }) => {
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
      style={({ pressed }) => [styles.llmCard, { backgroundColor: theme.cardBg, opacity: pressed ? 0.98 : 1, borderColor: theme.border }]}
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
                  <Text style={[styles.statusText, { color: llm.status === "active" ? "#2E7D32" : "#F57F17" }]}>{llm.status === "active" ? "Active" : "Soon"}</Text>
                </View>

                <Pressable onPress={onInfo} style={[styles.infoButton]} android_ripple={{ color: "#00000022" }}>
                  <Ionicons name="information-circle-outline" size={18} color={theme.textSecondary} />
                </Pressable>
              </View>
            </View>

            <Text style={[styles.llmDescription, { color: theme.textSecondary }]} numberOfLines={2}>{llm.description}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

// -------------------- Chat Screen --------------------
function ChatScreen({ route, navigation }: any) {
  const { theme } = useContext(ThemeContext);
  const { llmId } = route.params as { llmId: string };
  const llm = LLMS.find((m) => m.id === llmId) ?? LLMS[0];

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ id: string; from: "user" | "ai"; text: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList<any> | null>(null);

  const now = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const push = (msg: { id: string; from: "user" | "ai"; text: string; time: string }) =>
    setMessages((prev) => [...prev, msg]);

  const sendMessage = async () => {
    if (!prompt.trim() || loading) return;
    const userMsg = { id: Math.random().toString(36).slice(2), from: "user" as const, text: prompt.trim(), time: now() };
    push(userMsg);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://192.168.100.115:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.text, model: llm.id }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const aiText = data.response ?? "No response received.";
      push({ id: Math.random().toString(36).slice(2), from: "ai", text: aiText, time: now() });
    } catch (err: any) {
      // fallback mock reply
      push({
        id: Math.random().toString(36).slice(2),
        from: "ai",
        text: `(${llm.name} mock) Couldn't reach server — here's a quick reply to "${userMsg.text}".`,
        time: now(),
      });
      console.error("Send error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 200);
    }
  };

  const renderMessage = ({ item }: any) => {
    const isUser = item.from === "user";
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAI]}>
        {!isUser && (
          <View style={[styles.msgAvatar, { backgroundColor: llm.colorStart }]}>
            <LLMIcon icon={llm.icon} size={16} />
          </View>
        )}

        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={isUser ? styles.msgTextUser : styles.msgTextAI}>{item.text}</Text>
          <Text style={styles.msgTime}>{item.time}</Text>
        </View>

        {isUser && (
          <View style={styles.msgAvatarUser}>
            <Ionicons name="person-circle-outline" size={20} color="#6B7280" />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.chatHeader, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} android_ripple={{ color: "#00000022" }}>
          <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
        </Pressable>

        <View style={styles.chatHeaderRow}>
          <View style={[styles.chatIcon, { backgroundColor: llm.colorStart }]}>
            <LLMIcon icon={llm.icon} size={18} />
          </View>
          <View style={styles.chatInfo}>
            <Text style={[styles.chatTitle, { color: theme.text }]}>{llm.name}</Text>
            <Text style={[styles.chatSubtitle, { color: theme.textSecondary }]}>AI Assistant</Text>
          </View>
        </View>

        <View style={{ width: 44 }} />
      </View>

      <FlatList
        ref={flatRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(it) => it.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatRef.current?.scrollToEnd?.({ animated: true })}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={[styles.inputCard, { backgroundColor: theme.cardBg, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.textInput, { color: theme.text, backgroundColor: theme.bg }]}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Type your question here..."
            placeholderTextColor={theme.textSecondary}
            multiline
            editable={!loading}
          />
          <Pressable
            style={[styles.sendButton, loading && { opacity: 0.7 }]}
            onPress={sendMessage}
            disabled={!prompt.trim() || loading}
            android_ripple={{ color: "#ffffff22" }}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// -------------------- Settings Screen --------------------
function SettingsScreen() {
  const { isDark, toggle, theme } = useContext(ThemeContext);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerText, { color: theme.text }]}>Settings</Text>
            <Text style={[styles.headerSubtext, { color: theme.textSecondary }]}>App preferences</Text>
          </View>

          <Pressable style={[styles.themeButton, { backgroundColor: theme.maroon }]} onPress={toggle} android_ripple={{ color: "#00000022" }}>
            <Ionicons name={isDark ? "sunny-outline" : "moon"} size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={[styles.settingsRowCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.settingsText, { color: theme.text }]}>Theme</Text>
          <Text style={{ color: theme.textSecondary, marginTop: 8 }}>Use the toggle on the header to switch themes.</Text>
        </View>

        <View style={[styles.settingsRowCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.settingsText, { color: theme.text }]}>Backend</Text>
          <Text style={{ color: theme.textSecondary, marginTop: 8 }}>Connected to your local endpoint: <Text style={{ fontWeight: "700" }}>http://192.168.100.115:8000/chat</Text></Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header / top area
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

  // LLM card
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

  // modal
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

  // Chat
  chatHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  chatHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  chatSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 120,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  messageRowAI: {
    justifyContent: "flex-start",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  msgAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  msgAvatarUser: {
    marginLeft: 8,
  },
  bubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 12,
  },
  bubbleAI: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  bubbleUser: {
    backgroundColor: "#0F172A",
  },
  msgTextAI: {
    color: "#0F172A",
    fontSize: 15,
    lineHeight: 20,
  },
  msgTextUser: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
  },
  msgTime: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 6,
    alignSelf: "flex-end",
  },

  // input
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8B1F1F",
  },

  // settings card
  settingsRowCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
