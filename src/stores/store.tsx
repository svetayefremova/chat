import { useLocalStore } from "mobx-react";
import React, { createContext, useContext } from "react";

const storeContext = createContext(null);

const createStore = () => ({
  userId: null,
  currentChatId: null,
  chatsWithNotifications: new Map(
    JSON.parse(localStorage.getItem("chatsWithNotifications")),
  ),

  setUserId(id: string) {
    console.log("setUserId", id);
    this.userId = id;
  },

  setCurrentChatId(id: string) {
    this.currentChatId = id;
  },

  setChatsWithNotifications(chatRoomId: string) {
    this.chatsWithNotifications.set(
      chatRoomId,
      this.chatsWithNotifications.has(chatRoomId)
        ? this.chatsWithNotifications.get(chatRoomId) + 1
        : 1,
    );

    localStorage.setItem(
      "chatsWithNotifications",
      JSON.stringify(Array.from(this.chatsWithNotifications.entries())),
    );

    console.log("setChatNotifications", this.chatsWithNotifications);
  },

  clearChatNotifications(chatRoomId: string) {
    this.chatsWithNotifications.delete(chatRoomId);

    localStorage.setItem(
      "chatsWithNotifications",
      JSON.stringify(Array.from(this.chatsWithNotifications.entries())),
    );
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
