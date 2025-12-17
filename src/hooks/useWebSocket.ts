import { useRef, useCallback } from 'react';

export function useWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);

    const connect = useCallback((url: string, onMessage: (data: any) => void) => {
        if (wsRef.current) return wsRef.current;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (e) {
                console.error('Failed to parse WebSocket message', e);
            }
        };

        return ws;
    }, []);

    const disconnect = useCallback(() => {
        wsRef.current?.close();
        wsRef.current = null;
    }, []);

    const send = useCallback((data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        }
    }, []);

    return { connect, disconnect, send, wsRef };
}