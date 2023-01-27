import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Navigation from "./src/pages/Navigation";
import Login from "./src/pages/Login";

import {
  useAuthDispatch,
  useAuthState,
  JWTProvider,
} from "./src/hooks/useAuth";

const App = () => {
  const Stack = createStackNavigator();

  const { restoreToken } = useAuthDispatch();
  const { isLoading, jwt } = useAuthState();

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let isAdmin;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
        isAdmin = await SecureStore.getItemAsync("isAdmin");
        if (isAdmin === "true") isAdmin = true;
        else isAdmin = false;
      } catch (e) {
        console.error(e);
      }
      restoreToken(userToken, isAdmin);
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {jwt == null ? (
          <>
            <Stack.Screen
              name="SignIn"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Navigation"
              component={Navigation}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppWrapper = () => (
  <JWTProvider>
    <App />
  </JWTProvider>
);

export default AppWrapper;
