interface AnnotationToolbarProps {
    onClear: () => void;
    onSave: () => void;
    onUndo: () => void;
    hasAnnotations: boolean;
    hasCurrentAnnotations: boolean;
}

export const AnnotationToolbar = ({
    onClear,
    onSave,
    onUndo,
    hasAnnotations,
    hasCurrentAnnotations
}: AnnotationToolbarProps) => {
    return (
        <div className="flex gap-2 mb-4">
            <button
                onClick={onUndo}
                disabled={!hasCurrentAnnotations}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Undo Last Box
            </button>
            <button
                onClick={onClear}
                disabled={!hasAnnotations}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Clear All
            </button>
            <button
                onClick={onSave}
                disabled={!hasAnnotations}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Save Annotations
            </button>
        </div>
    );
};

export default AnnotationToolbar;