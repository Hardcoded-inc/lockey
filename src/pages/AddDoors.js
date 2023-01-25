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
import * as Location from "expo-location";
import { useAuthState } from "../hooks/useAuth";


const AddDoors = ({ route, navigation }) => {
  const [name, setName] = useState(null);
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);
  const [location, setLocation] = useState();
  const [isLocation, setIsLocation] = useState(false);

  useEffect(() => {
    const checkLocalisation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      try {
        const res = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        setLocation(res);
        console.log("location" + res);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLocation(true);
        setLong(String(location.coords.longitude));
        setLat(String(location.coords.latitude));
      }
    };

    checkLocalisation();
  }, [isLocation]);

  console.log(isLocation);
  const jwt = useAuthState();


  const createDoors = async () => {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Bareer: jwt,
      },
      method: "POST",
      body: JSON.stringify({
        door: { name: name, long: long, lat: lat },
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

          <TextInput
            label="Długość geograficzna"
            variant="standard"
            value={long}
            onChangeText={setLong}
            autoCapitalize="none"
            keyboardType="text"
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <TextInput
            label="Szerokość geograficzna"
            variant="standard"
            value={lat}
            onChangeText={setLat}
            autoCapitalize="none"
            keyboardType="text"
            returnKeyType="next"
            blurOnSubmit={false}
          />

          {name === null || lat === null || long === null ? (
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

export default AddDoors;

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});
