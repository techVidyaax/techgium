import React from 'react';
import { Car, AlertTriangle, Shield, Camera } from 'lucide-react';

interface Obstacle {
  x: number;
  y: number;
  severity: 'low' | 'medium' | 'high';
}

const LidarDisplay: React.FC = () => {
  const [obstacles] = React.useState<Obstacle[]>([
    { x: 30, y: 40, severity: 'low' },
    { x: 60, y: 70, severity: 'high' },
    { x: 80, y: 20, severity: 'medium' },
  ]);

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-xl p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(0,0,0,0))]" />
      
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 opacity-20">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border border-violet-500/20" />
        ))}
      </div>

      {/* Car Indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Car className="w-16 h-16 text-violet-500 animate-pulse" />
      </div>

      {/* Obstacles */}
      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 animate-ping-slow
            ${obstacle.severity === 'high' ? 'text-red-500' : 
              obstacle.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}
          style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
      ))}

      {/* Scanning Effect */}
      <div className="absolute inset-0 origin-center animate-scan">
        <div className="h-full w-[2px] bg-gradient-to-b from-violet-500/0 via-violet-500/50 to-violet-500/0 
          transform translate-x-[50vw]" />
      </div>
    </div>
  );
};

export default LidarDisplay;