import React, { useState } from "react";
import { SafeAreaProvider, StyleSheet, SafeAreaView, Text } from 'react-native';
import {
  AppBar,
  IconButton,
  Button,
  Avatar,
} from "@react-native-material/core";

const TopBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <AppBar
    title="Home"
    trailing={props =>
        loggedIn ? (
            <IconButton
            icon={<Avatar label="Yaman KATBY" size={28} />}
            onPress={() => setLoggedIn(!loggedIn)}
            {...props}
            />
            ) : (
                <Button
                variant="text"
                title="Login"
                compact
                style={{ marginEnd: 4 }}
                onPress={() => setLoggedIn(!loggedIn)}
                {...props}
                />
                )
            }
            />
  );
};

export default TopBar;