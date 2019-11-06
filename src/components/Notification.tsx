import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../stores/store";

import { useNewNotificationSubscription } from "../hooks/hooks";

const Notification = () => {
  const { userId } = useStore();
  const { data } = useNewNotificationSubscription(userId);

  useEffect(() => {
    if (data) {
      const { payload } = data.newNotification;
      const { content, authorId } = JSON.parse(payload);
      if (authorId !== userId) {
        toast(content);
      }
    }
  }, [data, userId]);

  return <ToastContainer />;
};

export default Notification;
