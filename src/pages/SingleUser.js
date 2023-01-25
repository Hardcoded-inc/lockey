import {
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { Component } from "react";
import {
  Provider,
  Text,
  Stack,
  Box,
  Flex,
  Divider,
  ListItem,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Button,
} from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { API_URL } from "../vars.js";

import { useAuthState } from "../hooks/useAuth";

const SingleUser = ({ route, navigation }) => {
  const { id } = route.params;

  const [user, setUser] = useState();
  const [doorId, setDoorId] = useState();
  const [pickedDoor, setPickedDoor] = useState();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [flag, setFlag] = useState();
  const [availableDoors, setAvailableDoors] = useState();
  const [userDoors, setUserDoors] = useState(null);

  const { jwt } = useAuthState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(API_URL + "/users/" + id + "/available_doors", {
          headers: {
            Bareer: jwt,
          },
        });
        const json = await res.json();
        setUser(json);
        setAvailableDoors(json.available_doors);
        setUserId(json.ID);
        console.log(json);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoadingUser(false);
      }
    };

    const fetchDoors = async () => {
      try {
        const res = await fetch(API_URL + "/users/" + id, {
          headers: {
            Bareer: jwt,
          },
        });
        const json = await res.json();
        if (json.doors.length > 0) {
          setUserDoors(json.doors);
        } else {
          setUserDoors(null);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    fetchDoors();
  }, [flag]);

  const activateDialog = (id, type) => {
    switch (type) {
      case "detach":
        setDoorId(id);
        setVisible(true);
        break;

      case "attach":
        setDoorId(null);
        setVisibleAdd(true);
        break;

      default:
        break;
    }
  };

  const detachUserFromDoors = async () => {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Bareer: jwt,
      },
      method: "POST",
      body: JSON.stringify({ user_id: userId, door_id: doorId }),
    };

    let res = null;
    try {
      res = await fetch(API_URL + "/users/remove_door", options);
    } catch (e) {
      console.log(e);
    } finally {
      setVisible(false);
      if (res.status === 200) alert("Drzwi zostały odłączone od użytkownika");
      else alert("Wystąpił błąd");
      setFlag(1);
    }
  };

  const attachUserToDoors = async () => {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Bareer: jwt,
      },
      method: "POST",
      body: JSON.stringify({ user_id: userId, door_id: doorId }),
    };

    let res = null;
    try {
      res = await fetch(API_URL + "/users/assign_door", options);
    } catch (e) {
      console.log(e);
    } finally {
      setVisibleAdd(false);
      if (res.status === 200) alert("Drzwi zostały dodane do użytkownika");
      else alert("Wystąpił błąd");
      setFlag(2);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outer}>
      <View style={styles.inner}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : isLoadingUser ? (
          <></>
        ) : (
          <>
            <Stack m={12} spacing={24} display={"flex"}>
              <Flex>
                <Text variant="overline">NAZWA UŻYTKOWNIKA</Text>
                <Text variant="h5">{user.username}</Text>
              </Flex>

              <Flex>
                <Text variant="overline">TYP UPRAWNIEŃ</Text>
                {user.is_admin ? (
                  <Text variant="h5">Administrator</Text>
                ) : (
                  <Text variant="h5">Użytkownik</Text>
                )}
              </Flex>

              <Flex>
                <Text variant="overline">
                  DOSTĘP DO DRZWI (NACIŚNIJ BY USUNĄĆ)
                </Text>
                {userDoors === null ? (
                  <></>
                ) : (
                  userDoors.map((door) => (
                    <ListItem
                      key={door.ID}
                      title={door.name}
                      id={"door_" + door.ID}
                      onPress={() => activateDialog(door.ID, "detach")}
                    />
                  ))
                )}
              </Flex>

              <Flex>
                <Button
                  title="Dodaj uprawnienia do drzwi +"
                  onPress={() => activateDialog(id, "attach")}
                />
              </Flex>
            </Stack>
          </>
        )}
        {!isLoading && !isLoadingUser ? (
          <>
            <Provider>
              <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <DialogHeader title="Edycja uprawnień" />
                <DialogContent>
                  <Text>
                    Możesz odebrać użytkownikowi uprawnienia do otwierania drzwi
                  </Text>
                </DialogContent>
                <DialogActions>
                  <Button
                    title="Anuluj"
                    compact
                    variant="text"
                    onPress={() => setVisible(false)}
                  />
                  <Button
                    title="Usuń"
                    compact
                    variant="text"
                    onPress={() => detachUserFromDoors()}
                  />
                </DialogActions>
              </Dialog>
            </Provider>
            <Provider>
              <Dialog
                style={{}}
                visible={visibleAdd}
                onDismiss={() => setVisibleAdd(false)}
              >
                <DialogHeader title="Edycja uprawnień" />
                <DialogContent>
                  <Text>
                    Możesz dodać użytkownikowi uprawnienia do otwierania drzwi.
                    W tym celu wybierz drzwi, a następnie zatwierdź
                  </Text>
                </DialogContent>
                <DialogContent>
                  <Stack spacing={2}>
                    <Text>
                      Wybierz jedne z dostępnych dla użytkownika drzwi
                    </Text>
                    <Text>Wybrane drzwi: {pickedDoor}</Text>
                    <ScrollView
                      style={{ marginBottom: 10, maxHeight: 200 }}
                      horizontal="true"
                    >
                      {availableDoors.map((door) => (
                        <ListItem
                          key={door.ID}
                          title={door.name}
                          id={"door_" + door.ID}
                          onPress={() => {
                            setPickedDoor(door.name);
                            setDoorId(door.ID);
                          }}
                        />
                      ))}
                    </ScrollView>
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button
                    title="Anuluj"
                    compact
                    variant="text"
                    onPress={() => setVisibleAdd(false)}
                  />
                  <Button
                    title="Dodaj"
                    compact
                    variant="text"
                    onPress={() => attachUserToDoors()}
                  />
                </DialogActions>
              </Dialog>
            </Provider>
          </>
        ) : (
          <></>
        )}
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
