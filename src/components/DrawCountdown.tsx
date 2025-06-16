
import React, { useState, useEffect } from 'react';

interface DrawCountdownProps {
  duration: number; // in seconds
  onComplete: () => void;
  onCancel: () => void;
}

const DrawCountdown: React.FC<DrawCountdownProps> = ({ duration, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 md:p-8 text-center max-w-sm mx-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Draw Starting In</h3>
        <div className="text-4xl md:text-6xl font-bold text-yellow-400 mb-6 animate-pulse">
          {timeLeft}
        </div>
        <button
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DrawCountdown;
