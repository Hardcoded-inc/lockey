import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Text,
  VStack,
  flex,
  Flex,
} from "@react-native-material/core";
import { useState, useEffect } from "react";
import { API_URL } from "@env";
import { useAuthState } from "../hooks/useAuth";

const SingleUser = ({ route, navigation }) => {
  const [login, setLogin] = useState(null);
  const [pass, setPass] = useState(null);

  const { jwt } = useAuthState();

  const createAccount = async () => {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Bareer: jwt,
      },
      method: "POST",
      body: JSON.stringify({
        user: { username: login, password: pass, is_admin: false },
      }),
    };

    let res = null;

    try {
      res = await fetch(API_URL + "/users", options);
      console.log(options);
    } catch (e) {
      console.log(e);
    } finally {
      if (res.status === 200) {
        alert("Konto użytkownika została założone. Nastąpi przekierowanie");
      } else {
        alert("Wystąpił błąd");
      }
      navigation.navigate("Users");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outer}>
      <View style={styles.inner}>
        <VStack m={16} spacing={32}>
          <Text variant="h5">Dodawanie użytkownika</Text>

          <TextInput
            label="Login"
            variant="standard"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
            keyboardType="text"
            returnKeyType="next"
            blurOnSubmit={false}
          />
          <TextInput
            label="Hasło"
            variant="standard"
            value={pass}
            onChangeText={setPass}
            autoCapitalize="none"
            keyboardType="password"
            blurOnSubmit={true}
          />

          {login === null || pass === null ? (
            <Button
              disabled
              title="Stwórz konto"
              onPress={() => createAccount()}
            />
          ) : (
            <Button title="Stwórz konto" onPress={() => createAccount()} />
          )}
        </VStack>
      </View>
    </ScrollView>
  );
};

export default SingleUser;

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});
