import React, { useState } from 'react';
import { PhotosSummary } from '@/api/strava/api';

interface ActivityPhotosProps {
    photoDetails?: PhotosSummary;
}

const ActivityPhotos: React.FC<ActivityPhotosProps> = ({ photoDetails }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // TODO improve
  if (photoDetails === undefined) {
    return null
  }
  
  // Return early if no photos were extracted
  if (photoDetails.count === 0) {
    return null;
  }

    // Function to extract photos from the activity
    const extractPhotos = () => {
        const photos = [];
        console.log("Photo details")
        console.log(photoDetails)
        // Add primary photo if it exists
        if (photoDetails.primary) {
            if (photoDetails.primary.urls) {
                photos.push({
                id: photoDetails.primary.unique_id,
                smallUrl: photoDetails.primary.urls['100'],
                largeUrl: photoDetails.primary.urls['600']
                });
            }
        }

        return photos
    }

    const photos = extractPhotos()
    console.log("Photos")
    console.log(photos)
  
  return (
    <div className="mt-4">
      <h4 className="mb-2 text-lg font-semibold">Activity Photos</h4>
      <div className="grid grid-cols-4 gap-2">
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="cursor-pointer overflow-hidden rounded-md"
            onClick={() => setSelectedImageIndex(index)}
          >
            <img 
              src={photo.smallUrl} 
              alt={`Activity photo ${index + 1}`}
              className="h-24 w-full object-cover transition-transform hover:scale-110"
            />
          </div>
        ))}
      </div>
      
      {/* Modal for full-size image when clicked */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="max-h-[90vh] max-w-[90vw]">
            <img
              src={photos[selectedImageIndex].largeUrl}
              alt={`Activity photo ${selectedImageIndex + 1} full size`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPhotos;