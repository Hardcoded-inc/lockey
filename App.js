import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "./src/components/TopBar";
import GlobalStyles from "./src/components/GlobalStyles";
import BottomNav from "./src/components/BottomNav";
import { Text } from "react-native";

export default function App() {
  return (
    <>
      <TopBar />
      <BottomNav />
    </>
  );
}
