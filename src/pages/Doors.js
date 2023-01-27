import { View, ScrollView, ActivityIndicator } from "react-native";
import {
  ListItem,
  Text,
  Stack,
  Divider,
  Button,
  Box,
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
        setIsLoading(false);
      }
    };

    const setupWebSocet = async () => {        
      const res = await fetch(API_URL + "/negotiate");
      const json = await res.json();
      
      let ws = new WebSocket(json.url);

      ws.onopen= () => {
        console.log('WebSocket Client Connected');
      };

      ws.onmessage = (message) => {
        setDoors(JSON.parse(JSON.parse(message.data)))
      };
    };

    fetchDoors();
    setupWebSocet()
  }, [doors]);

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
          <ScrollView style={{ marginBottom: 140 }} horizontal="true">
            {doors.map((door) => (
              <Box>
                <ListItem
                key={door.ID}
                title={door.name}
                id={"door_" + door.ID}
                leading={<Ionicons name={'radio-button-on-outline'} size={20} color={door.is_open ? 'green' : 'red'} />}
                onPress={() => {
                  navigation.navigate("SingleDoors", {
                    title: door.name,
                    id: door.ID,
                  });
                }}
                />
                <QRCode value={[{data: door.ID, mode: 'numeric'}]} />  
              </Box>
            ))}
          </ScrollView>
        )}
      </Stack>
    </View>
  );
};

export default Doors;
