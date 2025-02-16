import React, { useEffect, useState } from 'react';
import { Camera, AlertTriangle, Clock } from 'lucide-react';

interface Detection {
  id: string;
  timestamp: string;
  imageUrl: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const DetectionGallery: React.FC = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch detections from the Flask server
    fetch('http://127.0.0.1:5000/detections')  // Adjust the URL to your Flask API endpoint
      .then((response) => response.json())
      .then((data) => {
        setDetections(data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching detections:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {detections.map((detection) => (
        <div key={detection.id} className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="relative">
            {/* <img
              src={detection.imageUrl}
              alt={`Detection ${detection.id}`}
              className="w-full h-48 object-cover"
            /> */}
            <img
  src={`http://127.0.0.1:5000${detection.imageUrl}`}  // Flask automatically serves images from /static/
  alt={`Detection ${detection.id}`}
  className="w-full h-48 object-cover"
/>
            <div className="absolute top-2 right-2">
              <AlertTriangle
                className={`w-6 h-6 ${
                  detection.severity === 'high'
                    ? 'text-red-500'
                    : detection.severity === 'medium'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              />
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400">Detection #{detection.id}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{detection.timestamp}</span>
              </div>
            </div>
            <p className="text-slate-300">{detection.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetectionGallery;
