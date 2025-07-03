
import React, { useState } from 'react';
import { Play, Square, TestTube, Trash2, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useRealTimeDraws } from '@/hooks/useRealTimeDraws';

interface AdminDrawControlsProps {
  customers: any[];
  events: any[];
  prizes: string[];
  countdownDuration: number;
}

const AdminDrawControls: React.FC<AdminDrawControlsProps> = ({
  customers,
  events,
  prizes,
  countdownDuration
}) => {
  const { 
    activeDraw, 
    isConnected, 
    connectionError,
    startCountdownDraw, 
    completeDraw,
    createTestDraw,
    clearAllDraws,
    emergencyReset
  } = useRealTimeDraws(true);
  
  const [isLoading, setIsLoading] = useState(false);

  const activeEvent = events.find(e => e.active);

  const handleStartDraw = async () => {
    if (!activeEvent || !startCountdownDraw) return;
    
    setIsLoading(true);
    try {
      await startCountdownDraw(
        activeEvent.id,
        prizes.slice(0, activeEvent.winners_count),
        countdownDuration,
        customers.length
      );
    } catch (error) {
      console.error('Failed to start draw:', error);
      alert('Failed to start draw: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopDraw = async () => {
    if (!activeDraw || !completeDraw) return;
    
    setIsLoading(true);
    try {
      await completeDraw(activeDraw.id);
    } catch (error) {
      console.error('Failed to stop draw:', error);
      alert('Failed to stop draw: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestDraw = async () => {
    if (!createTestDraw) return;
    
    setIsLoading(true);
    try {
      await createTestDraw();
    } catch (error) {
      console.error('Failed to create test draw:', error);
      alert('Failed to create test draw: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDraws = async () => {
    if (!clearAllDraws) return;
    if (!confirm('Are you sure you want to clear all draws? This cannot be undone.')) return;
    
    setIsLoading(true);
    try {
      await clearAllDraws();
    } catch (error) {
      console.error('Failed to clear draws:', error);
      alert('Failed to clear draws: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyReset = async () => {
    if (!emergencyReset) return;
    if (!confirm('EMERGENCY RESET: This will clear all draw data and reset the system. Are you absolutely sure?')) return;
    
    setIsLoading(true);
    try {
      await emergencyReset();
      alert('Emergency reset completed successfully');
    } catch (error) {
      console.error('Failed to perform emergency reset:', error);
      alert('Failed to perform emergency reset: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-4 md:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-white">🎮 Draw Controls</h3>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-5 h-5 text-green-400" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" />
          )}
          <span className="text-sm text-white/80">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {connectionError && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-4">
          <p className="text-red-200 text-sm">⚠️ {connectionError}</p>
        </div>
      )}

      {/* Current Draw Status */}
      {activeDraw && (
        <div className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20">
          <h4 className="font-bold text-green-300 mb-2">🔴 LIVE DRAW ACTIVE</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Status: <span className="font-bold capitalize">{activeDraw.status}</span></div>
            <div>Participants: <span className="font-bold">{activeDraw.total_participants}</span></div>
            <div>Prizes: <span className="font-bold">{activeDraw.prizes.length}</span></div>
            <div>Winners: <span className="font-bold">{activeDraw.current_winners.length}</span></div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Start Draw */}
        <button
          onClick={handleStartDraw}
          disabled={isLoading || !!activeDraw || !activeEvent}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 px-4 py-3 rounded-lg transition-colors flex flex-col items-center space-y-1 text-sm"
        >
          <Play className="w-4 h-4" />
          <span>Start</span>
        </button>

        {/* Stop Draw */}
        <button
          onClick={handleStopDraw}
          disabled={isLoading || !activeDraw}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 px-4 py-3 rounded-lg transition-colors flex flex-col items-center space-y-1 text-sm"
        >
          <Square className="w-4 h-4" />
          <span>Stop</span>
        </button>

        {/* Test Draw */}
        <button
          onClick={handleTestDraw}
          disabled={isLoading || !!activeDraw}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 px-4 py-3 rounded-lg transition-colors flex flex-col items-center space-y-1 text-sm"
        >
          <TestTube className="w-4 h-4" />
          <span>Test</span>
        </button>

        {/* Clear All */}
        <button
          onClick={handleClearDraws}
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 px-4 py-3 rounded-lg transition-colors flex flex-col items-center space-y-1 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>

        {/* Emergency Reset */}
        <button
          onClick={handleEmergencyReset}
          disabled={isLoading}
          className="bg-red-700 hover:bg-red-800 disabled:bg-gray-500 px-4 py-3 rounded-lg transition-colors flex flex-col items-center space-y-1 text-sm border-2 border-red-400"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Status Info */}
      <div className="mt-4 text-xs text-white/70 space-y-1">
        <div>• Use "Test" to create a sample draw for preview</div>
        <div>• "Start" requires an active event with customers</div>
        <div>• "Clear" removes all draw data (use with caution)</div>
        {!activeEvent && (
          <div className="text-yellow-300">⚠️ No active event selected</div>
        )}
        {customers.length === 0 && (
          <div className="text-yellow-300">⚠️ No customers available for draw</div>
        )}
      </div>
    </div>
  );
};

export default AdminDrawControls;
