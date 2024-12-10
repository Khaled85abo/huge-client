import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../hooks/redux";
import { Job } from '../redux/features/transfer/jobSlice';
import config from '../config';


const Dashboard: FC = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all');
    const user = useAppSelector((state) => state.auth.user);
    // const [currentFile, setCurrentFile] = useState<string>("");
    // const stateJobs = useAppSelector((state) => state.job.jobs);
    const [jobs, setJobs] = useState<Job[]>([
        { id: '1', status: 'pending', startDate: '2024-01-01', ownership: 'John Doe', storageSource: 'Source 1', storageDestination: 'Destination 1' },
        { id: '2', status: 'in-progress', startDate: '2024-01-02', ownership: 'Jane Doe', storageSource: '@pisms_/home/khaled/SMS-client', storageDestination: '@pimaster_/home/khaled/SMS-client', progress: 10, bytesTransferred: 450000000, totalBytes: 1000000000, estimatedTimeRemaining: 1800 },
        { id: '3', status: 'completed', startDate: '2024-01-03', completeDate: '2024-01-04', ownership: 'Alice Smith', storageSource: 'Source 3', storageDestination: 'Destination 3' },
        { id: '4', status: 'failed', startDate: '2024-01-05', ownership: 'Bob Johnson', storageSource: 'Source 4', storageDestination: 'Destination 4' },

    ]);



    const filteredJobs = jobs.filter(job =>
        statusFilter === 'all' ? true : job.status === statusFilter
    );

    const getStatusColor = (status: Job['status']) => {
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

    // function updateProgressBar(progress: number) {
    //     const updatedJobs = jobs.map(job => {
    //         if (job.status === 'in-progress') {
    //             return {
    //                 ...job,
    //                 progress: progress
    //             };
    //         }
    //         return job;
    //     });
    //     setJobs(updatedJobs);
    // }

    // function updateCurrentFile(filename: string) {
    //     setCurrentFile(filename);
    // }

    function updateTransferStats(
        bytesTransferred: number,
        totalBytes: number,
        estimatedTimeRemaining: number,
        progress: number
    ) {
        const updatedJobs = jobs.map(job => {
            if (job.status === 'in-progress') {
                return {
                    ...job,
                    bytesTransferred,
                    totalBytes,
                    estimatedTimeRemaining,
                    progress

                };
            }
            return job;
        });
        setJobs(updatedJobs);
    }


    useEffect(() => {
        // const userId = user?.id;
        const userId = 1;
        if (!userId) return;
        const ws = new WebSocket(`${config.WS_USER_URL}/${userId}`);

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            if (data.type === 'transfer_progress') {
                if (data.error) {
                    console.error('Transfer error:', data.error);
                } else {
                    // updateProgressBar(data.progress);
                    // if (data.current_file) {
                    //     console.log(data.current_file);
                    //     updateCurrentFile(data.current_file);
                    // }
                    if (data.bytes_transferred && data.total_bytes) {
                        console.log(data.bytes_transferred, data.total_bytes);
                        updateTransferStats(
                            data.bytes_transferred,
                            data.total_bytes,
                            data.estimated_time_remaining,
                            data.progress
                        );
                    }
                }
            }
        };
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
        return () => {
            ws.close();
        };
    }, [user?.id]);

    // useEffect(() => {
    //     setJobs(stateJobs);
    // }, [stateJobs]);


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
                        onClick={() => setStatusFilter(status as Job['status'] | 'all')}
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
                {filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(job.status)}`}>
                                {job.status}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <span className="text-gray-600 text-sm">Dates</span>
                                <p className="text-gray-900">
                                    Start: {new Date(job.startDate).toLocaleDateString()}
                                    {job.completeDate && (
                                        <span className="ml-2">• Complete: {new Date(job.completeDate).toLocaleDateString()}</span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <span className="text-gray-600 text-sm">Ownership</span>
                                <p className="text-gray-900">{job.ownership}</p>
                            </div>

                            <div>
                                <span className="text-gray-600 text-sm">Storage</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-900">From: {job.storageSource}</span>
                                    <span className="text-gray-400">→</span>
                                    <span className="text-gray-900">To: {job.storageDestination}</span>
                                </div>
                            </div>

                            {job.status === 'in-progress' && job.progress !== undefined && (
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Transfer Progress <span className="text-gray-900 ml-3"> {job.progress}%</span> </span>
                                        <span className="text-gray-900">
                                            {formatBytes(job.bytesTransferred || 0)} of {formatBytes(job.totalBytes || 0)}
                                            {job.estimatedTimeRemaining && (
                                                <span className="ml-2 text-gray-500">
                                                    • {formatTime(job.estimatedTimeRemaining)} remaining
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    {/* for single file transfer info */}
                                    {/* 
                                    {currentFile && (
                                        <div className="text-sm text-gray-500 mb-2">
                                            Currently transferring: {currentFile}
                                        </div>
                                    )} */}

                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${job.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredJobs.length === 0 && (
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