import { createContext } from "react";

export const AuthContext = createContext();

const AUTHENTICATED = "AUTHENTICATED";

const registerUser = () =>
  fetch("https://run.mocky.io/v3/dd598227-c275-48e8-9840-c588293ead84", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: "jonaskuiler",
    }),
  }).then((response) => response.json());
