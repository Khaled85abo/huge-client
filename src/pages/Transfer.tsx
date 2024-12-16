import React, { useState } from 'react';
import { useCreateJobMutation } from '../redux/features/transfer/transferApi';
const Transfer = () => {
    const [createJob, { isLoading, isSuccess }] = useCreateJobMutation();
    const [formData, setFormData] = useState({
        organisation: 'org',
        email: 'org@org.com',
        source_storage: '/home/khaled/SMS-client',
        dest_storage: '/home/khaled/SMS-client',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        createJob({ source_storage: formData.source_storage, dest_storage: formData.dest_storage });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="grid place-items-center">
            <div className="p-4 min-w-[400px]">
                <h1 className="text-2xl font-bold mb-4">Transfer Files</h1>
                <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                    <div>
                        <label htmlFor="organisation" className="block mb-1">
                            Organisation
                        </label>
                        <input
                            type="text"
                            id="organisation"
                            name="organisation"
                            value={formData.organisation}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fileLocation" className="block mb-1">
                            File Location on MAX IV
                        </label>
                        <input
                            type="text"
                            id="fileLocation"
                            name="source_storage"
                            value={formData.source_storage}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fileDestination" className="block mb-1">
                            File Destination on ICE
                        </label>
                        <input
                            type="text"
                            id="fileDestination"
                            name="dest_storage"
                            value={formData.dest_storage}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Transferring...' : 'Submit Transfer Request'}
                    </button>
                </form>
                {isSuccess && <div className="mt-4 text-green-500">Transfer request submitted successfully!</div>}
            </div>
        </div>
    );
};

export default Transfer;
