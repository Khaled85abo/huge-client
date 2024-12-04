import { useState } from 'react';

interface SearchTrainingImagesProps {
    imagesToSearch: string[];
    setImagesToSearch: (imagesToSearch: string[]) => void;
    handleSearchImages: () => void;
    isLoading: boolean;
    error: string | null;
}

export const SearchTrainingImages = ({ imagesToSearch, setImagesToSearch, handleSearchImages, isLoading, error }: SearchTrainingImagesProps) => {
    const [newClass, setNewClass] = useState('');

    const addClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (newClass.trim() && !imagesToSearch.includes(newClass.trim())) {
            setImagesToSearch([...imagesToSearch, newClass.trim()]);
            setNewClass('');
        }
    };

    const removeClass = (classToRemove: string) => {
        setImagesToSearch(imagesToSearch.filter(c => c !== classToRemove));
    };

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Search Images</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 pb-1">
                <span className="font-medium">Step 1:</span>
                <span>Search images to annotate</span>
            </div>
            <form onSubmit={addClass} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    placeholder="Enter image name"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Add Image
                </button>
            </form>
            <div className="flex flex-wrap gap-2">
                {imagesToSearch.map((ImageToSearch, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                    >
                        <span className="text-sm">
                            {ImageToSearch}
                        </span>
                        <button
                            onClick={() => removeClass(ImageToSearch)}
                            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            {imagesToSearch.length > 0 && (
                <div className="flex justify-end mt-2">
                    <button onClick={handleSearchImages} disabled={isLoading} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">{isLoading ? 'Loading...' : 'Get Images'}</button>
                </div>
            )}
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
};

export default SearchTrainingImages;
