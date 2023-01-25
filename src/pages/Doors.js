import { View, ScrollView, ActivityIndicator } from "react-native";
import {
  ListItem,
  Text,
  Stack,
  Divider,
  Button,
} from "@react-native-material/core";
import { useState, useEffect } from "react";
import { API_URL } from "@env";
import { useAuthState } from "../hooks/useAuth";

export const Doors = ({ navigation }) => {
  const [doors, setDoors] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const { jwt } = useAuthState();

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

    fetchDoors();
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

        <Divider style={{ marginTop: 12 }} color="green" />
        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <ScrollView style={{ marginBottom: 140 }} horizontal="true">
            {doors.map((door) => (
              <ListItem
                key={door.ID}
                title={door.name}
                id={"door_" + door.ID}
                onPress={() => {
                  navigation.navigate("SingleDoors", {
                    title: door.name,
                    id: door.ID,
                  });
                }}
              />
            ))}
          </ScrollView>
        )}
      </Stack>
    </View>
  );
};

export default Doors;
