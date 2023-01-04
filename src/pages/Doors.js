import { View, ScrollView, ActivityIndicator, Button } from "react-native";
import { ListItem, Text, Stack, Divider } from "@react-native-material/core";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const StackNav = createNativeStackNavigator();

export const DoorsList = ({ navigation }) => {
  const [doors, setDoors] = useState([
    {
      title: "Test doors title",
      localisation: "San Francisco, US",
      id: 8,
    },
    {
      title: "Test doors title2",
      localisation: "Los Angeles, US",
      id: 1,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const res = await fetch("https://localhost/api/doors");
        const json = await res.json();
        setDoors(json);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoors();
  }),
    [];

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
                key={door.id}
                title={door.title}
                secondaryText={door.localisation}
                id={"door_" + door.id}
                onPress={() => {
                  navigation.navigate("SingleDoors", {
                    title: door.title,
                    id: door.id,
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

const SingleDoors = ({ route, navigation }) => {
  const { id } = route.params;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Doors</Text>
      <Text>itemId: {JSON.stringify(id)}</Text>
    </View>
  );
};

const Doors = () => {
  return (
    <NavigationContainer independent="true">
      <StackNav.Navigator>
        <StackNav.Screen
          options={{ headerShown: false }}
          name="DoorsList"
          component={DoorsList}
        />
        <StackNav.Screen
          name="SingleDoors"
          component={SingleDoors}
          options={({ route }) => ({ title: route.params.title })}
        />
      </StackNav.Navigator>
    </NavigationContainer>
  );
};

export default Doors;
