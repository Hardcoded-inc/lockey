import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  ListItem,
  Text,
  Stack,
  Button,
  Box,
  Provider,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
} from "@react-native-material/core";
import { useState, useEffect } from "react";
import { API_URL } from "../vars.js";
import { useAuthState } from "../hooks/useAuth";
import Ionicons from "react-native-vector-icons/Ionicons";
import QRCode from "react-native-qrcode-svg";

export const Doors = ({ navigation }) => {
  const [doors, setDoors] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { jwt, isAdmin } = useAuthState();
  const [visible, setVisible] = useState(false);
  const [picked, setPicked] = useState(false);
  const [reloadDoors, setReloadDooors] = useState(false)

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const res = await fetch(API_URL + "/doors", {
          headers: {
            Bareer: jwt,
          },
        });
        const json = await res.json();
        setDoors(json);
      } catch (e) {
        console.log(e);
      } finally {
        setReloadDooors(false)
        setIsLoading(false);
      }
    };

    fetchDoors();
  }, [doors, reloadDoors]);

  useEffect(() => {
    const setupWebSocet = async () => {
      const res = await fetch(API_URL + "/negotiate");
      const json = await res.json();

      let ws = new WebSocket(json.url);

      ws.onopen = () => {
        console.log("WebSocket Client Connected");
      };

      ws.onmessage = (message) => {
        data = JSON.parse(JSON.parse(message.data));
        if (data.modified_resource === 'doors') {
          setReloadDooors(true)
        }
      };
    };

    setupWebSocet();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack m={12} spacing={12}>
        <Text variant="h5">Lista drzwi</Text>
        <Text variant="subtitle1">
          Lista przypisanych do Twojego konta drzwi
        </Text>
        {isAdmin ? (
          <Button
            title="Dodaj nowe drzwi"
            onPress={() => navigation.navigate("AddDoors")}
          />
        ) : (
          ""
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <>
            <ScrollView style={{ marginBottom: 140 }} horizontal="true">
              {doors.map((door) => (
                <Box style={styles.image}>
                  <ListItem
                    key={door.ID}
                    title={door.name}
                    id={"door_" + door.ID}
                    leadingMode="image"
                    leading={
                      <TouchableOpacity
                        onPress={() => {
                          setVisible(true);
                          setPicked(door.ID);
                        }}
                      >
                        <QRCode
                          size={60}
                          id={"image_" + door.ID}
                          value={[{ data: door.ID, mode: "numeric" }]}
                        />
                      </TouchableOpacity>
                    }
                    trailing={
                      <Ionicons
                        name={"radio-button-on-outline"}
                        size={20}
                        color={door.is_open ? "green" : "red"}
                      />
                    }
                    onPress={() => {
                      navigation.navigate("SingleDoors", {
                        title: door.name,
                        door_id: door.ID,
                      });
                    }}
                  />
                </Box>
              ))}
            </ScrollView>
            <Provider>
              <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <DialogHeader title="QR Code" />
                <DialogContent>
                  <QRCode
                    size={216}
                    key={"qr_" + picked}
                    value={[{ data: picked, mode: "numeric" }]}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    title="Ok"
                    compact
                    variant="text"
                    onPress={() => setVisible(false)}
                  />
                </DialogActions>
              </Dialog>
            </Provider>
          </>
        )}
      </Stack>
    </View>
  );
};

export default Doors;

const styles = StyleSheet.create({
  image: {
    marginBottom: 16,
  },
});
