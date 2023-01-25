import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Navigation from "./src/pages/Navigation";
import Login from "./src/pages/Login";
import Splash from "./src/pages/Splash";

import {
  useAuthDispatch,
  useAuthState,
  JWTProvider,
} from "./src/hooks/useAuth";

const AppInner = () => {
  const Stack = createStackNavigator();

  const dupa = useAuthDispatch();
  console.log("1", dupa);
  const jwt = useAuthState();

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      restoreToken(userToken);
    };

    bootstrapAsync();
  }, []);

  if (state.isLoading) {
    return <Splash />;
  }

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

const App = () => {
  <JWTProvider>
    <AppInner />
  </JWTProvider>;
};

export default App;
