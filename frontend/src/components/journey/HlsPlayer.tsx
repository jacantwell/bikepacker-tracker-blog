import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
    src: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let hls: Hls | null = null;
        const videoElement = videoRef.current;

        if (videoElement) {
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(videoElement);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoElement.play().catch(() => {
                        console.log("Autoplay was prevented by the browser.");
                    });
                });
            } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (mainly Safari)
                videoElement.src = src;
                videoElement.addEventListener('loadedmetadata', () => {
                     videoElement.play().catch(() => {
                        console.log("Autoplay was prevented by the browser.");
                    });
                });
            }
        }

        // Cleanup function to destroy hls instance on component unmount
        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]); // Re-run effect if the src changes

    return (
        <video
            ref={videoRef}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            controls
            muted // Autoplay is more likely to work when muted
            playsInline
            loop
        />
    );
};

export default HlsPlayer;