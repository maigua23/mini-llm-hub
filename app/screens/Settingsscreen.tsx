import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ThemeContext } from "../../config/theme";

export default function SettingsScreen() {
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
          <Text style={{ color: theme.textSecondary, marginTop: 8 }}>
            Connected to your local endpoint: <Text style={{ fontWeight: "700" }}>http://localhost:8000/chat</Text>
          </Text>
        </View>
      </ScrollView>
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