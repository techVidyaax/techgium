import React, { useState, useEffect } from "react";
import { Shield, Check } from "lucide-react";

const StatusPanel: React.FC = () => {
  const [statusMessages, setStatusMessages] = useState<string[]>([]);

  // Function to fetch status manually in case of an error with EventSource
  const fetchStatus = async () => {
    try {
      const response = await fetch("http://localhost:5001/status");
      const data = await response.json();
      setStatusMessages((prevMessages) => [data.message, ...prevMessages]);
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
  };

  useEffect(() => {
    // Initialize the EventSource for SSE
    const eventSource = new EventSource("http://localhost:6000/events");

    eventSource.onmessage = (event) => {
      // Add new message to the beginning of the messages array
      setStatusMessages((prevMessages) => [event.data, ...prevMessages]);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      // Start a 5-second interval to fetch the status manually
      const intervalId = setInterval(fetchStatus, 500);

      // Clear the interval when the component is unmounted or EventSource is closed
      return () => clearInterval(intervalId);
    };

    // Cleanup when component is unmounted or EventSource is closed
    return () => {
      eventSource.close();
    };
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  return (
    <div className="bg-slate-900 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Detected Objects</h3>
        <Shield className="w-5 h-5 text-green-500" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
          <span className="text-slate-300">LiDAR Sensor</span>
          <Check className="w-5 h-5 text-green-500" />
        </div>

        <div className="p-3 rounded-lg bg-slate-800">
          <span className="text-slate-300">Status:</span>
          <div className="space-y-2">
            {statusMessages.map((message, index) => (
              <div key={index} className="text-slate-400 text-sm">
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
