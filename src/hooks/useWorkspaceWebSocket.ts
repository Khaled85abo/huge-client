import { useEffect, useRef } from 'react';
import config from '../config';

type WebSocketCallbacks = {
    onWorkspaceUpdated?: () => void;
    onWorkspaceDeleted?: (workspaceId: string) => void;
    onUserAdded?: () => void;
    onBoxChanged?: () => void;
    onResourceStatusUpdated?: () => void;
};

export const useWorkspaceWebSocket = (workspaceId: string | undefined, callbacks: WebSocketCallbacks) => {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!workspaceId) return;

        const ws = new WebSocket(`${config.WS_WORKSPACE_URL}/${workspaceId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'workspace_updated':
                    callbacks.onWorkspaceUpdated?.();
                    break;

                case 'workspace_deleted':
                    callbacks.onWorkspaceDeleted?.(data.workspace_id);
                    break;

                case 'user_added':
                    callbacks.onUserAdded?.();
                    break;

                case 'box_created':
                case 'box_updated':
                case 'box_deleted':
                    callbacks.onBoxChanged?.();
                    break;

                case 'resource_status_updated':
                    callbacks.onResourceStatusUpdated?.();
                    break;

                default:
                    console.log('Unknown message type:', data.type);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [workspaceId]);

    return wsRef.current;
};

// Example usage:
// useWorkspaceWebSocket(workspaceId, {
//     onWorkspaceUpdated: () => getSingleWorkspace(workspaceId),
//     onWorkspaceDeleted: (deletedWorkspaceId) => {
//         if (deletedWorkspaceId === workspaceId) {
//             navigate('/workspaces');
//         }
//     },
//     onUserAdded: () => getSingleWorkspace(workspaceId),
//     onBoxChanged: () => getSingleWorkspace(workspaceId),
//     onResourceStatusUpdated: () => getWorkspaceResources(workspaceId)
// });