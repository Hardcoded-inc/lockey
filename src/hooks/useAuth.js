import { API_URL } from "@env";
import React, { useReducer, useContext, useCallback } from "react";

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
      };
    case SIGN_IN:
      return {
        ...prevState,
        isSignout: false,
        jwt: payload.jwt,
      };
    case SIGN_OUT:
      return {
        ...prevState,
        isSignout: true,
        jwt: null,
      };
  }
};

export default reducer;

function useAuth() {
  const [state, dispatchJWT] = useReducer(reducer, {
    isLoading: true,
    isSignout: false,
    jwt: null,
  });

  const signIn = useCallback(
    ({ username, password }) => {
      const url = API_URL + "/login";

      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }).then((response) => {
        const { jwt } = response.json();

        dispatchJWT({
          action: SIGN_IN,
          payload: { jwt },
        });
      });
    },
    [dispatchJWT]
  );

  const signOut = useCallback(() => {
    dispatchJWT({
      action: SIGN_OUT,
    });
  }, [dispatchJWT]);

  const restoreToken = useCallback(
    (jwt) => {
      dispatchJWT({
        action: RESTORE_TOKEN,
        payload: { jwt },
      });
    },
    [dispatchJWT]
  );

  return { state, signIn, signOut, restoreToken };
}

export function JWTProvider({ children }) {
  const { state, signIn, signOut, restoreToken } = useAuth();

  console.log("3");

  const actions = {
    signIn,
    signOut,
    restoreToken,
  };

  console.log("2", actions);

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
