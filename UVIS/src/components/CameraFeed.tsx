import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);  // Store the media stream for cleanup

  useEffect(() => {
    const startVideoStream = async () => {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream; // Save the stream for later cleanup
      }
    };
    startVideoStream();

    // Set a timer to stop the webcam after 30 seconds (30,000 ms)
    const stopWebcamTimer = setTimeout(() => {
      if (mediaStreamRef.current) {
        const tracks = mediaStreamRef.current.getTracks();
        tracks.forEach((track) => track.stop());  // Stop all media tracks
        console.log('Webcam stopped automatically after 30 seconds.');
      }
    }, 30000);  // 30 seconds in milliseconds

    // Cleanup on component unmount or if the timer is cleared
    return () => {
      clearTimeout(stopWebcamTimer);  // Clear the timer if the component unmounts
      if (mediaStreamRef.current) {
        const tracks = mediaStreamRef.current.getTracks();
        tracks.forEach((track) => track.stop());  // Stop media tracks on unmount
      }
    };
  }, []);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Send image to backend
        const imageData = canvas.toDataURL('image/jpeg');
        sendToBackend(imageData);
      }
    }
  };

  const sendToBackend = async (imageData: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (response.ok) {
        const result = await response.json();
        setDetections(result.detections);
      } else {
        console.error('Failed to send data to backend');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="relative w-[90vw] h-[56.25vw] max-w-[700px] max-h-[400px] rounded-3xl overflow-hidden">
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>

        <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <Camera className="w-5 h-5 text-white animate-pulse" />
            <span className="text-white text-sm font-medium">Live Feed</span>
          </div>

          <div className="absolute top-4 right-4">
            <AlertCircle className="w-6 h-6 text-red-500 animate-bounce" />
          </div>
        </div>

        {/* Display detections */}
        <div className="absolute bottom-4 left-4 text-white">
          {detections.map((detection, index) => (
            <p key={index}>{detection.label} - {Math.round(detection.confidence * 100)}%</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;
