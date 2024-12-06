import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../hooks/redux";


interface Project {
    id: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    startDate: string;
    completeDate?: string;
    ownership: string;
    storageSource: string;
    storageDestination: string;
    progress?: number;
    bytesTransferred?: number;
    totalBytes?: number;
    estimatedTimeRemaining?: number;
}

const Dashboard: FC = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<Project['status'] | 'all'>('all');
    const user = useAppSelector((state) => state.auth.user);
    // Mock data - replace with your actual data source
    const projects: Project[] = [
        { id: '1', status: 'pending', startDate: '2024-01-01', ownership: 'John Doe', storageSource: 'Source 1', storageDestination: 'Destination 1' },
        { id: '2', status: 'in-progress', startDate: '2024-01-02', ownership: 'Jane Doe', storageSource: 'Source 2', storageDestination: 'Destination 2', progress: 45, bytesTransferred: 450000000, totalBytes: 1000000000, estimatedTimeRemaining: 1800 },
        { id: '3', status: 'completed', startDate: '2024-01-03', completeDate: '2024-01-04', ownership: 'Alice Smith', storageSource: 'Source 3', storageDestination: 'Destination 3' },
        { id: '4', status: 'failed', startDate: '2024-01-05', ownership: 'Bob Johnson', storageSource: 'Source 4', storageDestination: 'Destination 4' },
    ];

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    };

    const filteredProjects = projects.filter(project =>
        statusFilter === 'all' ? true : project.status === statusFilter
    );
    function updateProgressBar(progress) {
        // Update your progress bar UI component
        const progressBar = document.getElementById('transfer-progress');
        // progressBar.style.width = `${progress}%`;
        // progressBar.setAttribute('aria-valuenow', progress);
    }

    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;
        const ws = new WebSocket(`ws://your-server/v1/ws/user/${userId}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'transfer_progress') {
                if (data.error) {
                    // Handle error
                    console.error('Transfer error:', data.error);
                } else {
                    // Update progress bar
                    updateProgressBar(data.progress);
                }
            }
        };
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
        return () => {
            ws.close();
        };
    }, []);

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Projects Dashboard</h1>
                <button
                    onClick={() => navigate('/transfer')}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    <span className="text-xl font-bold">+</span>
                    New Project
                </button>
            </div>

            <div className="mb-6 flex gap-2">
                {['all', 'pending', 'in-progress', 'completed', 'failed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status as Project['status'] | 'all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors
                            ${statusFilter === status
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(project.status)}`}>
                                {project.status}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <span className="text-gray-600 text-sm">Dates</span>
                                <p className="text-gray-900">
                                    Start: {new Date(project.startDate).toLocaleDateString()}
                                    {project.completeDate && (
                                        <span className="ml-2">• Complete: {new Date(project.completeDate).toLocaleDateString()}</span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <span className="text-gray-600 text-sm">Ownership</span>
                                <p className="text-gray-900">{project.ownership}</p>
                            </div>

                            <div>
                                <span className="text-gray-600 text-sm">Storage</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-900">From: {project.storageSource}</span>
                                    <span className="text-gray-400">→</span>
                                    <span className="text-gray-900">To: {project.storageDestination}</span>
                                </div>
                            </div>

                            {project.status === 'in-progress' && project.progress !== undefined && (
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Transfer Progress</span>
                                        <span className="text-gray-900">
                                            {formatBytes(project.bytesTransferred || 0)} of {formatBytes(project.totalBytes || 0)}
                                            {project.estimatedTimeRemaining && (
                                                <span className="ml-2 text-gray-500">
                                                    • {formatTime(project.estimatedTimeRemaining)} remaining
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                            {statusFilter === 'all'
                                ? 'No projects found. Create a new project to get started.'
                                : `No ${statusFilter} projects found.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;