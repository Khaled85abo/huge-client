import { Resource } from "../types/workspace";
import { bytesToMB } from "../utilities/bytesToMb";
import { useLazyGetWorkspaceResourcesQuery, useDeleteResourceMutation } from "../redux/features/resource/resourceApi";
import { useEffect, useState } from "react";
import ResourceForm from "./ResourceForm";
// import config from "../config";
type ResourcesListProps = {
    workspaceId: string | undefined
    resouceUpdateTrigger: number
}
const ResourcesList = ({ workspaceId, resouceUpdateTrigger }: ResourcesListProps) => {
    const [showResourceForm, setShowResourceForm] = useState(false);
    const [deleteResource, { isLoading: isDeletingResource }] = useDeleteResourceMutation();
    const [getWorkspaceResources, { data: workspaceResources }] = useLazyGetWorkspaceResourcesQuery();
    // const wsRef = useRef<WebSocket | null>(null);

    const handleResourceAdded = () => {
        // Refetch resources or update state as needed
        getWorkspaceResources(workspaceId);
        setShowResourceForm(false);
    };

    // Add this function to handle resource deletion
    const handleDeleteResource = (resourceId: number) => {
        // TODO: Implement the API call to delete the resource
        console.log(`Delete resource with ID: ${resourceId}`);
        deleteResource(resourceId)
            .unwrap()
            .then(() => {
                getWorkspaceResources(workspaceId);
            })

    };
    const toggleResourceForm = () => {
        setShowResourceForm(!showResourceForm);
    };

    useEffect(() => {
        getWorkspaceResources(workspaceId);
    }, [workspaceId]);

    // useEffect(() => {
    //     if (!workspaceId) return;

    //     // Initialize WebSocket connection
    //     const ws = new WebSocket(`${config.WS_WORKSPACE_URL}/${workspaceId}`);
    //     wsRef.current = ws;

    //     ws.onopen = () => {
    //         console.log('WebSocket Connected');
    //     };

    //     ws.onmessage = (event) => {
    //         const data = JSON.parse(event.data);

    //         switch (data.type) {
    //             case 'resource_status_updated':
    //                 // Refresh workspace data
    //                 getWorkspaceResources(workspaceId);
    //                 break;
    //             default:
    //                 console.log('Unknown message type:', data.type);
    //         }
    //     };

    //     ws.onerror = (error) => {
    //         console.error('WebSocket error:', error);
    //     };

    //     ws.onclose = () => {
    //         console.log('WebSocket disconnected');
    //     };


    //     // Cleanup function
    //     return () => {
    //         if (wsRef.current) {
    //             wsRef.current.close();
    //         }
    //     };
    // }, [workspaceId]); // Only re-run if workspaceId changes

    useEffect(() => {
        getWorkspaceResources(workspaceId);
    }, [resouceUpdateTrigger]);


    return <div className="mt-4  bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Resources</h2>
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            onClick={toggleResourceForm}
        >
            {showResourceForm ? 'Hide Resource Form' : 'Add New Resource'}
        </button>
        {showResourceForm && (
            <ResourceForm
                onResourceAdded={handleResourceAdded}
            />
        )}
        {workspaceResources && workspaceResources.length > 0 ? (
            <ul className="space-y-2">
                {workspaceResources.map((resource: Resource) => (
                    <li key={resource.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                        <div>
                            <h3 className="font-semibold">
                                {resource.name}
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({resource.file_extension})
                                </span>
                            </h3>
                            <p className="text-sm text-gray-600">{resource.description || 'No description'}</p>
                            <p className="text-xs text-gray-500">
                                Size: {bytesToMB(resource.file_size)} MB
                                <span className="ml-2">
                                    Status: <span className={`font-semibold ${resource.status === 'completed' ? 'text-green-600' :
                                        resource.status === 'pending' ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                        {resource.status}
                                    </span>
                                </span>
                            </p>
                            {resource.tags && (
                                <div className="mt-1">
                                    {resource.tags.map((tag, index) => (
                                        <span key={index} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                disabled={isDeletingResource}
                                onClick={() => handleDeleteResource(resource.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                                {isDeletingResource ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No resources available.</p>
        )}
    </div>
}

export default ResourcesList;