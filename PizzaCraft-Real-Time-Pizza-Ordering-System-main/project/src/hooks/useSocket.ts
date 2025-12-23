import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002', {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');

        if (user) {
          // Join user-specific room
          socketRef.current?.emit('join-user-room', user.id);

          // Join admin room if user is admin
          if (user.role === 'admin') {
            socketRef.current?.emit('join-admin-room');
          }
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  return socketRef.current;
};

export default useSocket;