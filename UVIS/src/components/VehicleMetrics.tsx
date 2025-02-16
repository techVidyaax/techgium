import React, { useEffect, useState } from 'react';
import { Battery, Fuel, Gauge, Thermometer } from 'lucide-react';

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: 'up' | 'down';
}> = ({ icon, label, value, trend }) => (
  <div className="bg-slate-800 rounded-xl p-4">
    <div className="flex items-center space-x-3 mb-2">
      <div className="text-violet-400">{icon}</div>
      <span className="text-slate-400 text-sm">{label}</span>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {trend && (
      <div className={`text-sm mt-1 ${
        trend === 'up' ? 'text-green-400' : 'text-red-400'
      }`}>
        {trend === 'up' ? '↑' : '↓'} {trend === 'up' ? '+2.3%' : '-1.5%'}
      </div>
    )}
  </div>
);

const VehicleMetrics: React.FC = () => {
  const [temperature, setTemperature] = useState<string>('Loading...');
  const [trend, setTrend] = useState<'up' | 'down'>();

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const latitude = 11.0168; // Coimbatore Latitude
        const longitude = 76.9558; // Coimbatore Longitude
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await response.json();
        const tempCelsius = data.current_weather.temperature;
        setTemperature(`${tempCelsius.toFixed(1)}°C`);
        setTrend(tempCelsius > 25 ? 'up' : 'down'); // Example trend logic
      } catch (error) {
        console.error('Error fetching temperature:', error);
        setTemperature('Unavailable');
      }
    };

    fetchTemperature();
    const intervalId = setInterval(fetchTemperature, 60000); // Update every 1 minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={<Battery className="w-6 h-6" />}
        label="Battery"
        value="87%"
        trend="down"
      />
      <MetricCard
        icon={<Fuel className="w-6 h-6" />}
        label="Fuel Level"
        value="65%"
        trend="down"
      />
      <MetricCard
        icon={<Gauge className="w-6 h-6" />}
        label="Speed"
        value="45 km/h"
      />
      <MetricCard
        icon={<Thermometer className="w-6 h-6" />}
        label="Temperature"
        value={temperature}
        trend={trend}
      />
    </div>
  );
};

export default VehicleMetrics;
