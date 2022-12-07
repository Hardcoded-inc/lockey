import React, { useState } from "react";
import {
  AppBar,
  IconButton,
  Button,
  Avatar,
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const Home = () => {
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

export default Home;