import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import IntroAnimation from './components/IntroAnimation';
import LidarDisplay from './components/LidarDisplay';
import CameraFeed from './components/CameraFeed';
import StatusPanel from './components/StatusPanel';
import VehicleMetrics from './components/VehicleMetrics';
import DetectionGallery from './components/DetectionGallery';
import NavigationTabs from './components/NavigationTabs';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
<header className="mb-8 flex flex-col items-center">
<div className="flex justify-between w-full px-10 lg:px-20"> 
    <img 
      src="https://srec.ac.in/themes/frontend/images/footer-logo.png" 
      alt="Main Logo" 
      className="h-12 sm:h-16 md:h-18 lg:h-19"
    />
    <img 
      src="https://pbs.twimg.com/profile_images/1062645348504559616/-US9P5Ve_400x400.jpg" 
      alt="Side Logo" 
      className="h-10 sm:h-16 md:h-18 lg:h-23 rounded-full"
    />
  </div>
  <p className="mt-4 text-slate-300 text-center text-xl sm:text-1xl md:text-2xl lg:text-2xl font-bold">
    Underbody Vehicle Inspection System
  </p> 
</header>
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <>
            <VehicleMetrics />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">LiDAR Detection View</h2>
                  <LidarDisplay />
                </div>
              </div>
              <StatusPanel />
            </div>
          </>
        )}

        {activeTab === 'detection' && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Detections</h2>
            <DetectionGallery />
          </div>
        )}

        {activeTab === 'camera' && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4"> Camera Feed</h2>
            <CameraFeed />
          </div>
        )}

        {activeTab === 'vehicle' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Vehicle Status</h2>
              <VehicleMetrics />
            </div>
            <StatusPanel />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
