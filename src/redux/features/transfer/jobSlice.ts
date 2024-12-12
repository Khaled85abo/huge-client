import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum JobStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface Job {
    id: number;
    status: JobStatus;
    user_id: number;
    task_id: string;
    created_date: Date;
    updated_date: Date;
    completeDate?: Date;
    description: string | null;
    ownership: string;
    source_storage: string;
    dest_storage: string;
    progress?: number;
    bytesTransferred?: number;
    totalBytes?: number;
    estimatedTimeRemaining?: number;
}

export interface JobUpdate {
    job_id: number;
    status: JobStatus;
    task_id: string;
    current: number;
    total: number;
    percent: number;
}
type InitialState = {
    jobs: Job[];
};
const initialState: InitialState = {
    jobs: [],
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
