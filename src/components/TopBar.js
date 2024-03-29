import React from "react";
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { AppBar, Button } from "@react-native-material/core";

import { useAuthDispatch, useAuthState } from "../hooks/useAuth";

const TopBar = () => {
  const { signIn, signOut, restoreToken } = useAuthDispatch();
  const { jwt } = useAuthState();

  return (
    <SafeAreaView style={styles.container}>
      <AppBar
        title="Lockey v.0000001"
        trailing={(props) => (
          <Button
            variant="text"
            title="WYLOGUJ SIĘ"
            compact
            style={{ marginEnd: 4 }}
            onPress={() => signOut()}
            {...props}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  text: {
    fontSize: 25,
    fontWeight: "500",
  },
});
