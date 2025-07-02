import React from 'react';

const MysticalLoadingAnimation: React.FC = () => {
  return (
    <div className="flex justify-center space-x-2 md:space-x-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

export default MysticalLoadingAnimation;