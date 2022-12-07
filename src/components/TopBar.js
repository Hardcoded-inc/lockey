import React, { useState } from "react";
import {
  SafeAreaProvider,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { AppBar } from "@react-native-material/core";

const TopBar = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AppBar title="Lockey v.0000001" />
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
