import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./navigation";

export default function App() {
  return (<SafeAreaProvider style={{ flex: 1 }}>
    <Navigation />
    <StatusBar style="light" />
  </SafeAreaProvider>)
}
