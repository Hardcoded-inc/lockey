import { View, ScrollView, ActivityIndicator } from "react-native";
import {
  ListItem,
  Text,
  Stack,
  Divider,
  Button,
} from "@react-native-material/core";
import { useState, useEffect } from "react";
import { API_URL } from "../vars.js";
import { useAuthState } from "../hooks/useAuth";
import Ionicons from "react-native-vector-icons/Ionicons";

export const Doors = ({ navigation }) => {
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { jwt } = useAuthState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL + "/users", {
          headers: {
            Bareer: jwt,
          },
        });
        const json = await res.json();
        console.log(json);
        setUsers(json);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
                key={user.id}
                title={user.username}
                leading={<Ionicons name="person-outline" />}
                id={"user_" + user.id}
                onPress={() => {
                  navigation.navigate("SingleUser", {
                    title: user.username,
                    id: user.id,
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
