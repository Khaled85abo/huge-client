import { useState, useRef, useEffect } from 'react';
import type { Annotations, Image } from '../../types/trainModel';

interface ImageAnnotatorProps {
    images: Image[];
    classes: string[];
    onAnnotationsChange: (annotations: Annotations) => void;
    annotations: Annotations;
    setAnnotations: React.Dispatch<React.SetStateAction<Annotations>>;
    currentImage: Image | null;
    setCurrentImage: React.Dispatch<React.SetStateAction<Image | null>>;
}

export const ImageAnnotator = ({
    images,
    classes,
    onAnnotationsChange,
    annotations,
    setAnnotations,
    currentImage,
    setCurrentImage
}: ImageAnnotatorProps) => {
    const [selectedClass, setSelectedClass] = useState(0);
    const [drawing, setDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        onAnnotationsChange(annotations);
    }, [annotations, onAnnotationsChange]);

    useEffect(() => {
        if (currentImage && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.src = currentImage.url;
            img.onload = () => {
                // Calculate dimensions that maintain aspect ratio
                const aspectRatio = img.width / img.height;
                canvas.width = 800;
                canvas.height = Math.round(canvas.width / aspectRatio);

                setLoadedImage(img);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                drawExistingAnnotations();
            };
        }
    }, [currentImage]);

    useEffect(() => {
        if (currentImage && canvasRef.current && loadedImage) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Maintain aspect ratio when redrawing
            const aspectRatio = loadedImage.width / loadedImage.height;
            canvas.width = 800;
            canvas.height = Math.round(canvas.width / aspectRatio);

            // Clear and redraw everything
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
            drawExistingAnnotations();
        }
    }, [annotations, currentImage]);



    const handleImageSelect = (image: Image) => {
        console.log("selected image", image);
        setCurrentImage(image);
        if (!annotations[image.name]) {
            setAnnotations(prev => ({ ...prev, [image.name]: [] }));
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        setStartPos({ x, y });
        setDrawing(true);
        console.log("mousedown - start drawing", { x, y });
    };

    const drawBox = (e: React.MouseEvent<HTMLCanvasElement>) => {

        console.log("mousemove event", { drawing, hasLoadedImage: !!loadedImage });

        if (!drawing || !loadedImage) {
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const currentPos = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };

        console.log("drawing box", { startPos, currentPos });

        // Clear and redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
        drawExistingAnnotations();

        // Draw current box
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            startPos.x,
            startPos.y,
            currentPos.x - startPos.x,
            currentPos.y - startPos.y
        );
    };

    const finishDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawing || !currentImage || !canvasRef.current) return;
        console.log("finish drawing");

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const endPos = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };

        // Calculate normalized coordinates
        const imageWidth = canvas.width;
        const imageHeight = canvas.height;

        const x_center = ((startPos.x + endPos.x) / 2) / imageWidth;
        const y_center = ((startPos.y + endPos.y) / 2) / imageHeight;
        const width = Math.abs(endPos.x - startPos.x) / imageWidth;
        const height = Math.abs(endPos.y - startPos.y) / imageHeight;

        // Add annotation with safety check
        setAnnotations(prev => ({
            ...prev,
            [currentImage.name]: [
                ...(prev[currentImage.name] || []),
                {
                    dir: currentImage.dir,
                    class_id: selectedClass,
                    x_center,
                    y_center,
                    width,
                    height
                }
            ]
        }));

        setDrawing(false);
    };

    const drawExistingAnnotations = () => {
        if (!currentImage || !annotations[currentImage.name] || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        annotations[currentImage.name].forEach(ann => {
            const x = ann.x_center * canvas.width - (ann.width * canvas.width / 2);
            const y = ann.y_center * canvas.height - (ann.height * canvas.height / 2);
            const w = ann.width * canvas.width;
            const h = ann.height * canvas.height;

            // Draw the bounding box
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);

            // Draw label with background
            const label = classes[ann.class_id];
            ctx.font = '22px Arial';  // Set font size and family
            const textWidth = ctx.measureText(label).width;

            // Draw background for text
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(x, y - 20, textWidth + 4, 16);

            // Draw text
            ctx.fillStyle = '#ffffff';  // White text
            ctx.fillText(label, x + 2, y - 8);
        });
    };

    // Convert touch event to mouse-like event
    const touchToMouseEvent = (e: React.TouchEvent<HTMLCanvasElement>, eventType: string): React.MouseEvent<HTMLCanvasElement> => {
        const touch = eventType === 'mouseup' ? e.changedTouches[0] : e.touches[0];

        return {
            ...e,
            clientX: touch.clientX,
            clientY: touch.clientY,
            type: eventType
        } as unknown as React.MouseEvent<HTMLCanvasElement>;
    };

    // Touch event wrappers
    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        startDrawing(touchToMouseEvent(e, 'mousedown'));
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        drawBox(touchToMouseEvent(e, 'mousemove'));
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
        finishDrawing(touchToMouseEvent(e, 'mouseup'));
    };

    // Add this helper function before the return statement
    const getAnnotationCounts = (imageName: string) => {
        if (!annotations[imageName]) return {};

        return annotations[imageName].reduce((acc: { [key: string]: number }, ann) => {
            const className = classes[ann.class_id];
            acc[className] = (acc[className] || 0) + 1;
            return acc;
        }, {});
    };

    return (
        <div className="space-y-4">
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 pb-1">
                <span className="font-medium">Step 3:</span>
                <span>Annotate images</span>
            </div>
            <div className="flex gap-4 items-center">
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(parseInt(e.target.value))}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {classes.map((className, index) => (
                        <option key={index} value={index}>{className}</option>
                    ))}
                </select>
            </div>

            {currentImage && (
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        onMouseDown={startDrawing}
                        onMouseMove={drawBox}
                        onMouseUp={finishDrawing}
                        onMouseOut={finishDrawing}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchEnd}
                        className="border border-gray-300 rounded-lg w-full h-auto cursor-crosshair select-none touch-none"
                        style={{
                            touchAction: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            msUserSelect: 'none'
                        }}
                    />
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                {images.map((image) => (
                    <div
                        key={image.name}
                        className={`relative cursor-pointer overflow-hidden rounded-lg
                        ${currentImage?.name === image.name ? 'ring-4 ring-blue-500' : ''}`}
                        onClick={() => handleImageSelect(image)}
                        style={{ paddingBottom: '75%' }}
                    >
                        <img
                            src={image.url}
                            alt={image.name}
                            className="absolute inset-0 w-full h-full object-contain bg-gray-100"
                        />

                        {/* Draw annotation boxes on thumbnails */}
                        {annotations[image.name]?.length > 0 && (
                            <div className="absolute inset-0">
                                <svg
                                    className="w-full h-full"
                                    viewBox="0 0 800 600"
                                    preserveAspectRatio="none"
                                >
                                    {annotations[image.name].map((ann, idx) => (
                                        <rect
                                            key={idx}
                                            x={ann.x_center * 800 - (ann.width * 800) / 2}
                                            y={ann.y_center * 600 - (ann.height * 600) / 2}
                                            width={ann.width * 800}
                                            height={ann.height * 600}
                                            stroke="red"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                    ))}
                                </svg>
                            </div>
                        )}

                        {/* Show annotation counts */}
                        {annotations[image.name]?.length > 0 && (
                            <div className="absolute bottom-0 left-0 p-1 bg-black bg-opacity-50 text-white text-xs">
                                {Object.entries(getAnnotationCounts(image.name)).map(([className, count]) => (
                                    <div key={className}>{className}: {count}</div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};



export default ImageAnnotator;

