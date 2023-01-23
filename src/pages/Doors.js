import { View, ScrollView, ActivityIndicator, Button } from "react-native";
import { ListItem, Text, Stack, Divider } from "@react-native-material/core";
import { useState, useEffect } from "react";
import { API_URL } from "@env";

export const Doors = ({ navigation }) => {
  const [doors, setDoors] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const res = await fetch(API_URL + "/doors");
        const json = await res.json();
        setDoors(json);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoors();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack m={12} spacing={12}>
        <Text variant="h5">Lista drzwi</Text>
        <Text variant="subtitle1">
          Lista przypisanych do Twojego konta drzwi
        </Text>
        <Divider style={{ marginTop: 12 }} color="green" />
        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <ScrollView style={{ marginBottom: 100 }} horizontal="true">
            {doors.map((door) => (
              <ListItem
                key={door[0]}
                title={door[1]}
                secondaryText="xxx"
                id={"door_" + door[0]}
                onPress={() => {
                  navigation.navigate("SingleDoors", {
                    title: door[1],
                    id: door[0],
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
