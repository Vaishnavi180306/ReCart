import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socket = useRef(null);

  useEffect(() => {
    if (user) {
      socket.current = io('http://localhost:5000', {
        query: { userId: user._id },
      });
      return () => socket.current.disconnect();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};
