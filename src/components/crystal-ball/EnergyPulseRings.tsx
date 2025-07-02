import React, { useState, useEffect } from 'react';

const EnergyPulseRings: React.FC = () => {
  const [energyPulses, setEnergyPulses] = useState<Array<{id: number, delay: number}>>([]);

  useEffect(() => {
    const newPulses = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: i * 0.2
    }));
    setEnergyPulses(newPulses);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {energyPulses.map((pulse) => (
        <div
          key={pulse.id}
          className="absolute border-2 border-white/20 rounded-full animate-ping"
          style={{
            width: `${(pulse.id + 1) * 100}px`,
            height: `${(pulse.id + 1) * 100}px`,
            animationDelay: `${pulse.delay}s`,
            animationDuration: '3s'
          }}
        />
      ))}
    </div>
  );
};

export default EnergyPulseRings;