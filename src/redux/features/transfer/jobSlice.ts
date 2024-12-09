import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Job {
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
type InitialState = {
    jobs: Job[];
};
const initialState: InitialState = {
    jobs: [
        { id: '1', status: 'pending', startDate: '2024-01-01', ownership: 'John Doe', storageSource: 'Source 1', storageDestination: 'Destination 1' },
        { id: '2', status: 'in-progress', startDate: '2024-01-02', ownership: 'Jane Doe', storageSource: 'Source 2', storageDestination: 'Destination 2', progress: 45, bytesTransferred: 450000000, totalBytes: 1000000000, estimatedTimeRemaining: 1800 },
        { id: '3', status: 'completed', startDate: '2024-01-03', completeDate: '2024-01-04', ownership: 'Alice Smith', storageSource: 'Source 3', storageDestination: 'Destination 3' },
        { id: '4', status: 'failed', startDate: '2024-01-05', ownership: 'Bob Johnson', storageSource: 'Source 4', storageDestination: 'Destination 4' },

    ],
};

export const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
        setJobs: (state, action: PayloadAction<any[]>) => {
            state.jobs = action.payload;
        },
        addJob: (state, action: PayloadAction<any>) => {
            state.jobs.push(action.payload);
        },
        clearJobs: (state) => {
            state.jobs = [];
        },
        updateJob: (state, action: PayloadAction<any>) => {
            const job = state.jobs.find((t: any) => t.id === action.payload.id);
            if (job) {
                job.progress = action.payload.progress;
            }
        },
    },
});

export const { setJobs, addJob, clearJobs, updateJob } = jobSlice.actions;
export default jobSlice.reducer;
