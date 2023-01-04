import { View, ScrollView, ActivityIndicator, Button } from "react-native";
import { ListItem, Text, Stack, Divider } from "@react-native-material/core";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const StackNav = createNativeStackNavigator();

export const UsersList = ({ navigation }) => {
  const [users, setUsers] = useState([
    {
      name: "Tom Johnes",
      id: 8,
    },
    {
      name: "Emily Brown",
      id: 1,
    },
    {
      name: "Emily Brown",
      id: 2,
    },
    {
      name: "Emily Brown",
      id: 3,
    },
    {
      name: "Emily Brown",
      id: 4,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://localhost/api/users");
        const json = await res.json();
        setUsers(json);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }),
    [];

  return (
    <View style={{ flex: 1 }}>
      <Stack m={12} spacing={12}>
        <Text variant="h5">Lista użytkowników</Text>
        <Divider style={{ marginTop: 12 }} color="green" />
        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <ScrollView style={{ marginBottom: 100 }} horizontal="true">
            {users.map((user) => (
              <ListItem
                key={user.id}
                title={user.name}
                id={"user_" + user.id}
                onPress={() => {
                  navigation.navigate("SingleUsers", {
                    name: user.name,
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

const SingleUser = ({ route, navigation }) => {
  const { id } = route.params;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>User</Text>
      <Text>itemId: {JSON.stringify(id)}</Text>
    </View>
  );
};

const Users = () => {
  return (
    <NavigationContainer independent="true">
      <StackNav.Navigator>
        <StackNav.Screen
          options={{ headerShown: false }}
          name="UsersList"
          component={UsersList}
        />
        <StackNav.Screen
          name="SingleUsers"
          component={SingleUser}
          options={({ route }) => ({ name: route.params.name })}
        />
      </StackNav.Navigator>
    </NavigationContainer>
  );
};

export default Users;
