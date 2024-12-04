import { useState } from 'react';

interface ClassManagerProps {
    classes: string[];
    setClasses: (classes: string[]) => void;
}

export const ClassManager = ({ classes, setClasses }: ClassManagerProps) => {
    const [newClass, setNewClass] = useState('');

    const addClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (newClass.trim() && !classes.includes(newClass.trim())) {
            setClasses([...classes, newClass.trim()]);
            setNewClass('');
        }
    };

    const removeClass = (classToRemove: string) => {
        setClasses(classes.filter(c => c !== classToRemove));
    };

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Define Classes</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 pb-1">
                <span className="font-medium">Step 2:</span>
                <span>Define classes for the training images</span>
            </div>
            <form onSubmit={addClass} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    placeholder="Enter class name"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Add Class
                </button>
            </form>
            <div className="flex flex-wrap gap-2">
                {classes.map((className, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                    >
                        <span className="text-sm">
                            {index}: {className}
                        </span>
                        <button
                            onClick={() => removeClass(className)}
                            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassManager;
