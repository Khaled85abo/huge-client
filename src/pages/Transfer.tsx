import React, { useState } from 'react';

const Transfer = () => {
    const [formData, setFormData] = useState({
        organisation: '',
        email: '',
        fileLocation: '',
        fileDestination: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
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
                            name="fileLocation"
                            value={formData.fileLocation}
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
                            name="fileDestination"
                            value={formData.fileDestination}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Submit Transfer Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Transfer;
