import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { JSX, useState } from "react";
import { StatusBar } from "react-native";

import { ThemeContext, darkTheme, lightTheme } from "../config/theme";
import { ScreenParamList } from "../types";
import Chatscreen from "./screens/Chatscreen";
import Homescreen from "./screens/Homescreen";
import Settingsscreen from "./screens/Settingsscreen";

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
          <Stack.Screen name="Chat" component={Chatscreen} />
        </Stack.Navigator>
      </NavigationIndependentTree>
    </ThemeContext.Provider>
  );
}

function MainTabs() {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
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
              if (route.name === "Home") {
                return <Ionicons name="home-outline" size={size} color={color} />;
              } else if (route.name === "Settings") {
                return <Ionicons name="settings-outline" size={size} color={color} />;
              }
              return null;
            },
          })}
        >
          <Tabs.Screen name="Home" component={Homescreen} />
          <Tabs.Screen name="Settings" component={Settingsscreen} />
        </Tabs.Navigator>
      )}
    </ThemeContext.Consumer>
  );
}

