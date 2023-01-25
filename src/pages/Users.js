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
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const jwt = useAuthState();

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const res = await fetch(API_URL + "/users", {
          headers: {
            Bareer: jwt,
          },
        });
        setUsers(res);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoors();
  }, [users]);

  return (
    <View style={{ flex: 1 }}>
      <Stack m={12} spacing={12}>
        <Text variant="h5">Lista użytkowników</Text>
        <Button
          title="Dodaj nowego użytkownika"
          onPress={() => navigation.navigate("AddUser")}
        />
        <Divider style={{ marginTop: 12 }} color="green" />
        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <ScrollView style={{ marginBottom: 120 }} horizontal="true">
            {users.map((user) => (
              <ListItem
                key={user.ID}
                title={user.username}
                id={"user_" + user.ID}
                onPress={() => {
                  navigation.navigate("SingleUser", {
                    title: user.username,
                    id: user.ID,
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
