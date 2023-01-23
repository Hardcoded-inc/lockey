import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import SingleDoors from "../pages/SingleDoors";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <>
      <TopBar />
      <Stack.Navigator>
        <Stack.Screen
          name="BottomNav"
          component={BottomNav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SingleDoors"
          component={SingleDoors}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default Navigation;
