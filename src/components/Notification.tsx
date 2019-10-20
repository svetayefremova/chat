import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../stores/store";

import { useNewNotificationSubscription } from "../hooks/hooks";

const Notification = () => {
  const { userId, setChatsWithNotifications } = useStore();
  const { data } = useNewNotificationSubscription(userId);

  useEffect(() => {
    console.log("newNotification", data);
    if (data) {
      const { payload } = data.newNotification;
      const { content, authorId, chatRoomId } = JSON.parse(payload);
      if (authorId !== userId) {
        setChatsWithNotifications(chatRoomId);
        toast(content);
      }
    }
  }, [data, userId, setChatsWithNotifications]);

  return <ToastContainer />;
};

export default Notification;
