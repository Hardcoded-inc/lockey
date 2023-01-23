import React, { useState } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Home from "../pages/Home";
import QR_View from "../pages/QR";
import Doors from "../pages/Doors";
import Users from "../pages/Users";
import Ionicons from "react-native-vector-icons/Ionicons";

const Nav = createMaterialBottomTabNavigator();

const BottomNav = () => {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <Nav.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Doors") {
            iconName = focused ? "ios-key" : "ios-key-outline";
          } else if (route.name === "Users") {
            iconName = focused ? "ios-people" : "ios-people-outline";
          } else if (route.name === "QR") {
            iconName = focused ? "ios-barcode" : "ios-barcode-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Nav.Group>
        <Nav.Screen
          name="Home"
          component={Home}
          options={{
            title: "Home",
          }}
        />
        <Nav.Screen
          name="Doors"
          component={Doors}
          options={{
            title: "Doors list",
          }}
        />
        <Nav.Screen
          navigationKey={isAdmin ? "true" : "false"}
          name="Users"
          component={Users}
          options={{
            title: "Users list",
          }}
        />
        <Nav.Screen name="QR" component={QR_View} />
      </Nav.Group>
    </Nav.Navigator>
  );
};

export default BottomNav;
