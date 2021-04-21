import React, { createContext, useContext, useEffect, useState } from "react";
import UserInterface from "../interface/user_interface";
import fire from "../utils/firebase/firebase";
import { getUserDocument } from "../utils/firebase/firestore";
const USER_CONTEXT = createContext<[UserInterface | null | undefined, any]>([
  undefined,
  null,
]);

export function useUser() {
  return useContext(USER_CONTEXT);
}

export default function UserContext({ children }: any) {
  const [user, setUser] = useState<UserInterface | null | undefined>(undefined);
  useEffect(() => {
    fire.auth().onAuthStateChanged((user) => {
      if (user && user.email) {
        getUserDocument(user.email).then((doc: any) => {
          if (doc === null) {
            setUser(null);
          } else setUser({ ...doc.data(), uuid: doc.id });
        });
      } else setUser(null);
    });
  }, []);
  return (
    <USER_CONTEXT.Provider value={[user, setUser]}>
      {children}
    </USER_CONTEXT.Provider>
  );
}
