import React from 'react';
import { Car, Camera, AlertTriangle, Activity } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const NavigationTabs: React.FC<{
  activeTab: string;
  onTabChange: (tabId: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-5 h-5" /> },
    { id: 'detection', label: 'Detection', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'camera', label: 'Reverse Camera Feed', icon: <Camera className="w-5 h-5" /> },
    { id: 'vehicle', label: 'Vehicle', icon: <Car className="w-5 h-5" /> },
  ];

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
            ${activeTab === tab.id
              ? 'bg-violet-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;