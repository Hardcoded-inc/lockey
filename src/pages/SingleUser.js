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
import * as LocalAuthentication from "expo-local-authentication";
import { API_URL } from "@env";

const SingleUser = ({ route, navigation }) => {
  const { id } = route.params;

  const [user, setUser] = useState();
  const [doors, setDoors] = useState([
    [1, "Dupa666", false, "2023-01-14 19:31:44.307000"],
    [2, "Dupa333", false, "2023-01-14 19:31:44.307000"],
  ]);
  const [doorId, setDoorId] = useState();
  const [pickedDoor, setPickedDoor] = useState();
  const [userId, setUserId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [flag, setFlag] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(API_URL + "/users/" + id);
        const json = await res.json();
        setUser(json);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
        setUserId(user.ID);
      }
    };

    //TODO: fetch all user doors
    const fetchDoors = async () => {
      try {
        const res = await fetch(API_URL + "/doors/1");
        const json = await res.json();
        setDoors(json);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
        console.log(doors);
      }
    };

    fetchUser();

    //fetchDoors();
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
      },
      method: "POST",
      body: JSON.stringify({ user_id: userId, door_id: doorId }),
    };

    let res = null;
    try {
      res = await fetch(API_URL + "/users/attach_door", options);
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
        ) : (
          <>
            <Stack m={12} spacing={24} display={"flex"}>
              <Flex>
                <Text variant="overline">NAZWA UŻYTKOWNIKA</Text>
                <Text variant="h5">{user.username}</Text>
              </Flex>

              <Flex>
                <Text variant="overline">TYP UPRAWNIEŃ</Text>
                {!user[2] ? (
                  <Text variant="h5">Administrator</Text>
                ) : (
                  <Text variant="h5">Użytkownik</Text>
                )}
              </Flex>

              <Flex>
                <Text variant="overline">
                  DOSTĘP DO DRZWI (NACIŚNIJ BY USUNĄĆ)
                </Text>
                {doors.map((door) => (
                  <ListItem
                    key={door.ID}
                    title={door.username}
                    id={"door_" + door.ID}
                    onPress={() => activateDialog(id, "detach")}
                  />
                ))}
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
                Możesz dodać użytkownikowi uprawnienia do otwierania drzwi. W
                tym celu wybierz drzwi, a następnie zatwierdź
              </Text>
            </DialogContent>
            <DialogContent>
              <Stack spacing={2}>
                <Text>Wybierz jedne z dostępnych dla użytkownika drzwi</Text>
                <Text>Wybrane drzwi: {pickedDoor}</Text>
                {doors.map((door) => (
                  <ListItem
                    key={door.ID}
                    title={door.username}
                    id={"door_" + door.ID}
                    onPress={() => setPickedDoor(door.username)}
                  />
                ))}
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
