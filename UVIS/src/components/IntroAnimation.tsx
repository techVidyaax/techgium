import React, { useEffect, useState } from 'react';

const IntroAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(false);
      setTimeout(onComplete, 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!animate) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
      <div className={`transform transition-all duration-1000 ${
        animate ? 'scale-100 opacity-100' : 'scale-150 opacity-0'
      }`}>
        {/* Replace Shield with your own logo */}
        <img src="src\components\srec.png" alt="SREC Logo" className="w-500 h-500 animate-pulse" />
        <div className="mt-4 text-2xl font-bold text-white text-center">
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;