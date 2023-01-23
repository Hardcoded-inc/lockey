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

const SingleUser = ({ route, navigation }) => {
  const [name, setName] = useState(null);

  const createDoors = async () => {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        user: { name: name },
      }),
    };

    let res = null;

    try {
      res = await fetch(API_URL + "/doors", options);
      console.log(options);
    } catch (e) {
      console.log(e);
    } finally {
      if (res.status === 200) {
        alert("Drzwi zostały stworzone. Nastąpi przekierowanie");
      } else {
        alert("Wystąpił błąd");
      }
      navigation.navigate("Doors");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outer}>
      <View style={styles.inner}>
        <VStack m={16} spacing={32}>
          <Text variant="h5">Dodawanie drzwi</Text>

          <TextInput
            label="Nazwa drzwi"
            variant="standard"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            keyboardType="text"
            returnKeyType="next"
            blurOnSubmit={false}
          />

          {name === null ? (
            <Button
              disabled
              title="Stwórz drzwi"
              onPress={() => createDoors()}
            />
          ) : (
            <Button title="Stwórz drzwi" onPress={() => createDoors()} />
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
