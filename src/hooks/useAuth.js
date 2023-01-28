import { API_URL } from "../vars.js";
import React, { useReducer, useContext, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

export const JWTStateContext = React.createContext();
export const JWTDispatchContext = React.createContext();

const RESTORE_TOKEN = "RESTORE_TOKEN";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";

const reducer = (prevState, { action, payload }) => {
  switch (action) {
    case RESTORE_TOKEN:
      return {
        ...prevState,
        jwt: payload.jwt,
        isLoading: false,
        isAdmin: payload.isAdmin,
        // id: payload.id,
      };
    case SIGN_IN:
      return {
        ...prevState,
        isSignout: false,
        jwt: payload.jwt,
        isAdmin: payload.isAdmin,
        // id: payload.id,
      };
    case SIGN_OUT:
      return {
        ...prevState,
        isSignout: true,
        jwt: null,
        isAdmin: false,
        //  id: null,
      };
  }
};

export default reducer;

function useAuth() {
  const [state, dispatchJWT] = useReducer(reducer, {
    isLoading: true,
    isSignout: false,
    jwt: null,
    isAdmin: false,
    //  id: null,
  });

  const signIn = useCallback(
    async ({ username, password }) => {
      const url = API_URL + "/login";
      let errorMessage = null;
      let success = false;
      let jwt = null;
      let isAdmin = null;
      let id = null;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 200) {
        const cookie = response.headers.get("set-cookie");
        const json = await response.json();

        if (cookie) {
          jwt = json.jwt;
          isAdmin = json.is_admin;
          //id = json.id
        }
        success = true;
        await SecureStore.setItemAsync("userToken", jwt);
        await SecureStore.setItemAsync("isAdmin", String(isAdmin));
        // await SecureStore.setItemAsync("id", id);

        dispatchJWT({
          action: SIGN_IN,
          payload: {
            jwt,
            isAdmin,
            //id
          },
        });
      } else if (response.status === 401) {
        errorMessage = "Wrong password";
      } else if (response.status === 404) {
        errorMessage = "User does not exists";
      }

      return { errorMessage, success };
    },
    [dispatchJWT]
  );

  const signOut = useCallback(() => {
    dispatchJWT({
      action: SIGN_OUT,
    });
  }, [dispatchJWT]);

  const restoreToken = useCallback(
    (jwt, isAdmin) => {
      dispatchJWT({
        action: RESTORE_TOKEN,
        payload: {
          jwt,
          isAdmin,
          //	id
        },
      });
    },
    [dispatchJWT]
  );

  return { state, signIn, signOut, restoreToken };
}

export function JWTProvider({ children }) {
  const { state, signIn, signOut, restoreToken } = useAuth();

  const actions = {
    signIn,
    signOut,
    restoreToken,
  };

  return (
    <JWTStateContext.Provider value={state}>
      <JWTDispatchContext.Provider value={actions}>
        {children}
      </JWTDispatchContext.Provider>
    </JWTStateContext.Provider>
  );
}

export function useAuthDispatch() {
  return useContext(JWTDispatchContext);
}

export function useAuthState() {
  return useContext(JWTStateContext);
}
