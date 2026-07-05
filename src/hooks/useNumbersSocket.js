import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE } from '../api/api';

/**
 * Se conecta una sola vez al backend y llama a onUpdate(changes)
 * cada vez que llega el evento 'numbers:update', donde changes es
 * un array de { number_value, status }.
 */
export function useNumbersSocket(onUpdate) {
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    const socket = io(API_BASE, { transports: ['websocket', 'polling'] });

    socket.on('numbers:update', (changes) => {
      callbackRef.current(changes);
    });

    return () => socket.disconnect();
  }, []);
}
