import { Ionicons } from "@expo/vector-icons";
import { useContext, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { LLMIcon } from "../../components/LLMIcon";
import { LLMS } from "../../config/llm";
import { ThemeContext } from "../../config/theme";
import { Message } from "../../types";

export default function ChatScreen({ route, navigation }: any) {
  const { theme } = useContext(ThemeContext);
  const { llmId } = route.params as { llmId: string };
  const llm = LLMS.find((m) => m.id === llmId) ?? LLMS[0];

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList<any> | null>(null);

  const now = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const push = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const sendMessage = async () => {
    if (!prompt.trim() || loading) return;
    const userMsg: Message = { 
      id: Math.random().toString(36).slice(2), 
      from: "user", 
      text: prompt.trim(), 
      time: now() 
    };
    push(userMsg);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.text}),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const aiText = data.response ?? "No response received.";
      push({ 
        id: Math.random().toString(36).slice(2), 
        from: "ai", 
        text: aiText, 
        time: now() 
      });
    } catch (err: any) {
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

  const renderMessage = ({ item }: { item: Message }) => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    flex: 1,
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
})