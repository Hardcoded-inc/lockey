import { View, ActivityIndicator } from "react-native";
import { Text } from "@react-native-material/core";
import { useState, useEffect } from "react";

const SingleDoors = ({ route, navigation }) => {
  const { id } = route.params;

  const [doors, setDoors] = useState([
    {
      title: "Test doors title",
      localisation: "San Francisco, US",
      id: 8,
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const res = await fetch(
          "https://localhost/api/doors?" +
            new URLSearchParams({
              id: id,
            })
        );
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          <Text>itemId: {JSON.stringify(id)}</Text>
          <Text>Doors</Text>
        </>
      )}
    </View>
  );
};

export default SingleDoors;
