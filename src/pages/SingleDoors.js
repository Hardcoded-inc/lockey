import { View, ActivityIndicator } from "react-native";
import { Text, Stack, Button } from "@react-native-material/core";
import { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";

const SingleDoors = ({ route, navigation }) => {
  const { id } = route.params;

  const [doors, setDoors] = useState({
    title: "Test doors title",
    latitude: 37.78825,
    longitude: -122.4324,
    id: 8,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometry, setIsBiomtery] = useState(false);

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const res = await fetch(
          "https://localhost/api/doors?" +
            new URLSearchParams({
              id: id,
            })
        );
        const json = await res.json();
        setDoors(json);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    const isBiometricsAvailable = async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiomtery(compatible);
      } catch (e) {
        console.log(e);
      } finally {
        console.log(isBiometry);
      }
    };

    fetchDoors();
    isBiometricsAvailable();
  }),
    [];

  const openDoors = async () => {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

    if (!savedBiometrics) {
      return alert(
        "Biometric record not found",
        "Please verify your identity with your password",
        "OK",
        () => fallBackToDefaultAuth()
      );
    } else {
      const biometricAuth = await LocalAuthentication.authenticateAsync();

      if (biometricAuth.success === true) {
        alert("Drzwi zostaną otwarte");
      } else {
        alert("Spróbuj ponownie");
      }
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          <Stack m={12} spacing={12}>
            <Text variant="h5">{doors.title}</Text>
            <Text variant="h6">ID: {doors.id}</Text>
            <Text variant="subtitle1">
              Zeksanuj kod QR umieszczony bezpośrednio obok wejścia, a aplikacja
              automatycznie przeniesie Cię do konkretnych drzwi.
            </Text>
            <Button title="Otwórz drzwi" onPress={() => openDoors()} />
          </Stack>
        </>
      )}
    </View>
  );
};

export default SingleDoors;
