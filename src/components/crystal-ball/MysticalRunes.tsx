import React, { useState, useEffect } from 'react';

interface MysticalRunesProps {
  crystalIntensity: number;
}

const MysticalRunes: React.FC<MysticalRunesProps> = ({ crystalIntensity }) => {
  const [mysticalRunes, setMysticalRunes] = useState<Array<{id: number, symbol: string, x: number, y: number, rotation: number}>>([]);

  // Initialize mystical elements
  useEffect(() => {
    const runes = ['☾', '☽', '♦', '♧', '♠', '♥', '⚡', '🌙', '⭐', '💎'];
    const newRunes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      symbol: runes[Math.floor(Math.random() * runes.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360
    }));
    setMysticalRunes(newRunes);
  }, []);

  // Floating runes animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalRunes(prev => prev.map(rune => ({
        ...rune,
        x: (rune.x + Math.sin(Date.now() * 0.001 + rune.id) * 0.3) % 100,
        y: (rune.y + Math.cos(Date.now() * 0.0008 + rune.id) * 0.2) % 100,
        rotation: (rune.rotation + 0.5) % 360
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {mysticalRunes.map((rune) => (
        <div
          key={rune.id}
          className="absolute text-2xl text-white/30 transition-all duration-1000"
          style={{
            left: `${rune.x}%`,
            top: `${rune.y}%`,
            transform: `rotate(${rune.rotation}deg)`,
            textShadow: '0 0 20px rgba(255,255,255,0.5)',
            filter: `hue-rotate(${crystalIntensity * 3.6}deg)`
          }}
        >
          {rune.symbol}
        </div>
      ))}
    </div>
  );
};

export default MysticalRunes;