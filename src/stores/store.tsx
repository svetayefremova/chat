import { useLocalStore } from "mobx-react";
import React, { createContext, useContext } from "react";

const storeContext = createContext(null);

const createStore = () => ({
  userId: localStorage.getItem("userId"),
  currentChatId: null,

  setUserId(id: string) {
    this.userId = id;
    localStorage.setItem("userId", id);
  },

  setCurrentChatId(id: string) {
    this.currentChatId = id;
  },
});

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(createStore);

  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(storeContext);

  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
