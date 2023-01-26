import React, { useState, createRef, useContext, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { View, Keyboard } from "react-native";
import {
  TextInput,
  Stack,
  Text,
  Flex,
  Button,
  IconButton,
} from "@react-native-material/core";
import { useAuthDispatch, useAuthState } from "../hooks/useAuth";
import Ionicons from "react-native-vector-icons/Ionicons";

const Login = ({ navigation: { navigate } }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPass, setIsPass] = useState(true);
  const [error, setError] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = React.useState(true);

  const { signIn, signOut, restoreToken } = useAuthDispatch();
  const { jwt } = useAuthState();

  useEffect(() => {
    const checkBiometricsAvailability = async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);
      } catch (e) {
        console.error(e);
      }
    };

    checkBiometricsAvailability();
  }, []);

  const biometrySignIn = async () => {
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with fingerprint",
      cancelLabel: "cancel",
      disableDeviceFallback: true,
    });

    if (res.success) {
      const savedUsername = await SecureStore.getItemAsync("username");
      const savedPassword = await SecureStore.getItemAsync("password");

      if (!savedUsername) {
        setError("No credentials saved. Log in with username and password!");
        return;
      }

      setUsername(savedUsername);
      setPassword(savedPassword);

      const { errorMessage, success } = await signIn({
        username: savedUsername,
        password: savedPassword,
      });
      console.warn(errorMessage);
      if (!success && errorMessage) setError(errorMessage);
    }
  };

  const signInAndSaveCredentials = async () => {
    const { errorMessage, success } = await signIn({ username, password });

    if (success) {
      await SecureStore.setItemAsync("username", username);
      await SecureStore.setItemAsync("password", password);
    } else if (errorMessage) {
      setError(errorMessage);
    }
  };

  // -------------------
  //     AUTO LOGIN
  //   Remove for demo
  // -------------------
  //
  //   useEffect(() => {
  //     signIn({ username: "FirstUser", password: "justAString" });
  //   }, []);
  //
  // -------------------

  return (
    <View>
      <Flex justify={"center"} h={"100%"}>
        <Stack m={24} spacing={12}>
          <Text variant="h5">Zaloguj się</Text>
          <TextInput
            label="Login"
            variant="standard"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <TextInput
            label="Hasło"
            variant="standard"
            value={password}
            onChangeText={setPassword}
            keyboardType="default"
            onSubmitEditing={Keyboard.dismiss}
            secureTextEntry={isPass}
            returnKeyType="next"
            trailing={(props) => (
              <IconButton
                icon={(props) => (
                  <Ionicons
                    name={isPass ? "eye-outline" : "eye-off-outline"}
                    {...props}
                  />
                )}
                {...props}
                onPress={() => setIsPass(!isPass)}
              />
            )}
          />

          {error && (
            <Text variant="caption" color="red">
              {error}
            </Text>
          )}

          <Button
            type="submit"
            title="Zaloguj się"
            color="primary"
            onPress={signInAndSaveCredentials}
          />

          {isBiometricSupported ? (
            <Button
              type="submit"
              title="Zaloguj się odciskiem palca"
              color="primary"
              onPress={() => biometrySignIn()}
            />
          ) : (
            <Button
              type="submit"
              title="Zaloguj się odciskiem palca"
              color="primary"
              disabled
            />
          )}
        </Stack>
      </Flex>
    </View>
  );
};

export default Login;
