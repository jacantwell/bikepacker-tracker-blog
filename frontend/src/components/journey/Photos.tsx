import { useState, useEffect } from "react";
import HlsPlayer from "./HlsPlayer"; // Import the new component

interface PhotosProps {
    photoDetails: Photo[];
}

export interface Photo {
    id: string;
    smallUrl: string;
    largeUrl: string;
    videoUrl: string | null;
}

const Photos: React.FC<PhotosProps> = ({ photoDetails }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const totalPhotos = photoDetails.length;

    const handleNext = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prevIndex) => (prevIndex! + 1) % totalPhotos);
        }
    };

    const handlePrevious = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prevIndex) => (prevIndex! - 1 + totalPhotos) % totalPhotos);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            if (e.key === "ArrowRight") handleNext();
            else if (e.key === "ArrowLeft") handlePrevious();
            else if (e.key === "Escape") setSelectedImageIndex(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedImageIndex]);

    // Swipe navigation
    useEffect(() => {
        let touchStartX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const deltaX = touchEndX - touchStartX;

            if (deltaX > 50) {
                handlePrevious();
            } else if (deltaX < -50) {
                handleNext();
            }
        };

        if (selectedImageIndex !== null) {
            window.addEventListener("touchstart", handleTouchStart);
            window.addEventListener("touchend", handleTouchEnd);
        }

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [selectedImageIndex]);

    if (totalPhotos === 0) return null;

    const photosToPreview = photoDetails.slice(0, 3);
    const remainingPhotosCount = totalPhotos - photosToPreview.length;

    const currentItem = selectedImageIndex !== null ? photoDetails[selectedImageIndex] : null;

    return (
        <div className="mt-4">
            {/* --- Thumbnail Grid --- */}
            <div className="grid grid-cols-4 gap-2">
                {photosToPreview.map((photo, index) => {
                    const isLastPreview = index === photosToPreview.length - 1;
                    const showOverlay = isLastPreview && remainingPhotosCount > 0;

                    return (
                        <div
                            key={photo.id}
                            className="relative cursor-pointer overflow-hidden rounded-md"
                            onClick={() => setSelectedImageIndex(index)}
                        >
                            <img
                                src={photo.smallUrl}
                                alt={`Preview ${index + 1}`}
                                className="h-14 w-14 object-cover transition-transform hover:scale-110"
                            />
                            {photo.videoUrl && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <svg
                                        className="h-6 w-6 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                </div>
                            )}
                            {showOverlay && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <span className="text-lg font-bold text-white">
                                        +{remainingPhotosCount}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* --- Media Viewer Modal --- */}
            {currentItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    <div
                        className="relative flex items-center justify-center max-h-[90vh] max-w-[90vw]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left Arrow */}
                        <button
                            onClick={handlePrevious}
                            className="absolute left-2 sm:left-0 sm:-translate-x-12 z-10 rounded-full bg-black/40 p-3 text-white transition hover:bg-black/60"
                            aria-label="Previous"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        {/* Media */}
                        {currentItem.videoUrl ? (
                            <HlsPlayer src={currentItem.videoUrl} />
                        ) : (
                            <img
                                src={currentItem.largeUrl}
                                alt={`Media ${selectedImageIndex! + 1} full size`}
                                className="max-h-[90vh] max-w-[90vw] object-contain"
                            />
                        )}

                        {/* Right Arrow */}
                        <button
                            onClick={handleNext}
                            className="absolute right-2 sm:right-0 sm:translate-x-12 z-10 rounded-full bg-black/40 p-3 text-white transition hover:bg-black/60"
                            aria-label="Next"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Photos;
