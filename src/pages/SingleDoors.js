import {
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Stack,
  Button,
  Box,
  Flex,
  Divider,
  Icon,
} from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { API_URL } from "../vars.js";
import * as Location from "expo-location";
import { useAuthState } from "../hooks/useAuth";

const SingleDoors = ({ route, navigation }) => {
  const { door_id } = route.params;

  const [singleDoors, setSingleDoors] = useState();
  const [singleDoorsStatus, setSingleDoorsStatus] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometry, setIsBiomtery] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [location, setLocation] = useState();
  const [doorPermission, setDoorPermission] = useState(false);
  const [isLocationMatched, setIsLocationMatched] = useState(false);

  const {
    jwt,
    isAdmin,
    id
  } = useAuthState();

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const res = await fetch(API_URL + "/doors/" + door_id, {
          headers: {
            Bareer: jwt,
          },
        });
        const json = await res.json();
        setSingleDoors(json);
        setSingleDoorsStatus(json.is_open);

        if (json.users.length > 0 || isAdmin === true) {
          if(isAdmin === true){
            setDoorPermission(true)
          }else{
            json.users.forEach(user => {
              if(user.ID === id) { setDoorPermission(true) }
            });
          }
            
        }
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
      }
    };

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
        } catch (e) {
          console.log(e);
        } finally {
          setIsLocation(true);
        }
    };

    fetchDoors();
    isBiometricsAvailable();
    checkLocalisation();
  }, []);

  useEffect(() => {
    if(isAdmin === true){
      setIsLocationMatched(true);
    }else{
    if (isLocation === true && isLoading === false) {
      const phone_lat = location.coords.latitude.toFixed(2);
      const phone_long = location.coords.longitude.toFixed(2);

      //to do - replace with data from db
      const doors_lat = singleDoors.lat.toFixed(2);
      const doors_long = singleDoors.long.toFixed(2);

      if (phone_lat === doors_lat && phone_long === doors_long) {
        setIsLocationMatched(true);
      } else {
        setIsLocationMatched(false);
      }
    }
  }
  }, [isLoading, isLocation ]);

  const callDoorsAPI = async () => {
    let res = null;
    try {
      res = await fetch(API_URL + "/doors/" + door_id + "/open", {
        method: "POST",
        headers: {
          Bareer: jwt,
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      if (res.status === 200) {
        alert(
          "Drzwi zostały otwarte. Zamek pozostanie automatycznie zamknięty za 10 sekund"
        );
        setSingleDoorsStatus(true);
      } else {
        alert("Wystąpił błąd");
      }
    }
  };

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
        callDoorsAPI();
      } else {
        alert("Spróbuj ponownie");
      }
    }
  };

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          <Stack m={12} spacing={24} display={"flex"}>
            <Flex style={styles.flex_wrapper}>
              {!singleDoorsStatus ? (
                <>
                  {doorPermission && isLocationMatched ? (
                    <>
                      <TouchableOpacity onPress={() => openDoors()}>
                        <Box
                          w={144}
                          h={144}
                          p={16}
                          m={6}
                          mt={16}
                          style={styles.container}
                          borderColor={"green"}
                        >
                          <Image
                            style={styles.tinyLogo}
                            source={require("../assets/locked.png")}
                          />
                        </Box>
                      </TouchableOpacity>

                      <Text variant="button">
                        NACIŚNIJ KŁÓDKĘ, BY OTWORZYĆ DRZWI
                      </Text>
                    </>
                  ) : (
                    <>
                      <Box
                        w={144}
                        h={144}
                        p={16}
                        m={6}
                        mt={16}
                        style={styles.container}
                        borderColor={"red"}
                      >
                        <Image
                          style={styles.tinyLogo}
                          source={require("../assets/locked.png")}
                        />
                      </Box>

                      <Text variant="button">NIE MOŻESZ OTWORZYĆ DRZWI</Text>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Box
                    w={144}
                    h={144}
                    p={16}
                    m={6}
                    mt={16}
                    style={styles.container}
                    borderColor={"blue"}
                  >
                    <Image
                      style={styles.tinyLogo}
                      source={require("../assets/unlocked.png")}
                    />
                  </Box>

                  <Text variant="button">DRZWI OTWARTE</Text>
                </>
              )}
            </Flex>

            <Divider color={"black"} />

            <Flex>
              <Text variant="overline">NAZWA DRZWI</Text>
              <Text variant="h5">{singleDoors.name}</Text>
            </Flex>

            <Flex>
              <Text variant="overline">LOKALIZACJA DRZWI</Text>
              <Text variant="h5">
                {singleDoors.long.toFixed(2)}x{singleDoors.lat.toFixed(2)}
              </Text>
            </Flex>
            <Flex>
              <Text variant="overline">TWOJA LOKALIZACJA</Text>
              {isLocation ? (
                <Text variant="h5">
                  {location.coords.longitude.toFixed(2)}x
                  {location.coords.latitude.toFixed(2)}
                </Text>
              ) : (
                <></>
              )}
            </Flex>
            <Flex>
              <Text variant="overline">DOSTĘP DO DRZWI</Text>
              <Flex direction="row" alignItems="center">
                {doorPermission ? (
                  <Ionicons
                    name={"checkmark-outline"}
                    size={24}
                    color={"green"}
                  />
                ) : (
                  <Ionicons name={"close-outline"} size={24} color={"red"} />
                )}
                <Text variant="body1"> Autoryzacja dostępu</Text>
              </Flex>
              <Flex direction="row" alignItems="center">
                {!isLocation ? (
                  <>
                    <Ionicons
                      name={"reload-outline"}
                      size={24}
                      color={"orange"}
                    />
                    <Text style={styles.text} variant="body1">
                      Oczekiwanie na określenie lokalizacji...
                    </Text>
                  </>
                ) : (
                  <>
                    {isLocationMatched ? (
                      <Ionicons
                        name={"checkmark-outline"}
                        size={24}
                        color={"green"}
                      />
                    ) : (
                      <Ionicons
                        name={"close-outline"}
                        size={24}
                        color={"red"}
                      />
                    )}
                    <Text style={styles.text} variant="body1">
                      Urządzenie w zasięgu drzwi
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>
          </Stack>
        </>
      )}
    </View>
  );
};

export default SingleDoors;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 64,
    height: 64,
  },
  container: {
    borderRadius: 128,
    borderWidth: 4,
    backgroundColor: "#D9D9D9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  flex_wrapper: {
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    direction: "row",
  },
  text: {
    marginLeft: 5,
  },
});
