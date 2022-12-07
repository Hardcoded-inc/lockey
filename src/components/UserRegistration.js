import React, { FC, ReactElement, useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";

export const UserRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const doUserRegistration = async function () {
    const usernameValue = username;
    const passwordValue = password;
    // return await Parse.User.signUp(usernameValue, passwordValue)
    //   .then((createdUser) => {
    //     Alert.alert(
    //       "Success!",
    //       `User ${createdUser.get("username")} was successfully created!`
    //     );
    //     return true;
    //   })
    //   .catch((error) => {
    //     Alert.alert("Error!", error.message);
    //     return false;
    //   });
  };

  return (
    <>
      <TextInput
        style={styles.input}
        value={username}
        placeholder={"Username"}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder={"Password"}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title={"Sign Up"} onPress={() => doUserRegistration()} />
    </>
  );
};

export default UserRegistration;