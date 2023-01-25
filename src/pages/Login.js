import React, { useState, createRef, useContext, useEffect } from "react";
import { AuthContext } from "../components/AuthContext";
import { View, Keyboard } from "react-native";
import {
  TextInput,
  Stack,
  Text,
  Flex,
  Button,
} from "@react-native-material/core";

const Login = ({ navigation: { navigate } }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = React.useState(true);

  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  return (
    <View>
      <Flex justify={"center"} h={"100%"}>
        <Stack m={24} spacing={12}>
          <Text variant="h5">Zaloguj się</Text>
          <TextInput
            label="Adres e-mail"
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
            secureTextEntry
            returnKeyType="next"
          />

          <Button
            type="submit"
            title="Zaloguj się"
            color="primary"
            onPress={() => signIn({ username, password })}
          />

          {isBiometricSupported ? (
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
          )}
        </Stack>
      </Flex>
    </View>
  );
};

export default Login;
