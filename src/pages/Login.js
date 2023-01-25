import React, { useState, createRef, useContext, useEffect } from "react";
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
  const [isBiometricSupported, setIsBiometricSupported] = React.useState(true);

  const { signIn, signOut, restoreToken } = useAuthDispatch();
  const { jwt } = useAuthState();

  // useEffect(() => {
  //   (async () => {
  //     const compatible = await LocalAuthentication.hasHardwareAsync();
  //     setIsBiometricSupported(compatible);
  //   })();
  // });

  useEffect(() => {
    // TODO: Remove for demo
    signIn({ username: "FirstUser", password: "justAString" });
  });

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

          <Button
            type="submit"
            title="Zaloguj się"
            color="primary"
            onPress={() => signIn({ username, password })}
          />

          {/* {isBiometricSupported ? (
            <Button
              type="submit"
              title="Zaloguj się odciskiem palca"
              color="primary"
              onPress={() => signIn({ username, password })}
            />
          ) : (
            <Button
              type="submit"
              title="Zaloguj się odciskiem palca"
              color="primary"
              disabled
            />
          )} */}
        </Stack>
      </Flex>
    </View>
  );
};

export default Login;
