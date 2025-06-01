// src/context/NotificationContext.tsx
import { createContext, useContext, useState } from "react";

type Notification = { message: string; timestamp: string };
const NotificationContext = createContext<{
  log: Notification[];
  addLog: (msg: string) => void;
}>({ log: [], addLog: () => {} });

export const useNotificationLog = () => useContext(NotificationContext);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [log, setLog] = useState<Notification[]>([]);

  const addLog = (message: string) => {
    const entry = { message, timestamp: new Date().toLocaleString() };
    setLog((prev) => [entry, ...prev.slice(0, 4)]);
  };

  return (
    <NotificationContext.Provider value={{ log, addLog }}>
      {children}
    </NotificationContext.Provider>
  );
};
