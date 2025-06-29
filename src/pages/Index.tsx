
import React from 'react';
import LotteryHeader from '../components/LotteryHeader';
import LotteryFooter from '../components/LotteryFooter';
import LiveUserMonitor from '../components/LiveUserMonitor';
import LotteryOverlays from '../components/LotteryOverlays';
import PageRenderer from '../components/PageRenderer';
import { usePageState } from '../hooks/usePageState';
import { useRealTimeDraws } from '../hooks/useRealTimeDraws';
import { useDrawLogic } from '../hooks/useDrawLogic';
import { useLotteryData } from '../hooks/useLotteryData';

const Index = () => {
  const {
    currentPage,
    setCurrentPage,
    isAdmin,
    setIsAdmin,
    adminPassword,
    setAdminPassword,
    showPassword,
    setShowPassword,
    adminLogin
  } = usePageState();

  const {
    customers,
    events,
    winners,
    draws,
    externalLinks
  } = useLotteryData();

  const { activeDraw, updateDrawStatus, completeDraw } = useRealTimeDraws(isAdmin);

  const {
    isDrawing,
    showCrystalBalls,
    setShowCrystalBalls,
    showWinnerReveal,
    currentWinners,
    currentPrizes,
    conductDraw,
    handleAnimationComplete,
    closeWinnerReveal,
    goBackToDraw
  } = useDrawLogic(customers, events);

  const handleCountdownComplete = async () => {
    console.log('Countdown completed, starting crystal balls animation');
    
    if (activeDraw && updateDrawStatus) {
      await updateDrawStatus(activeDraw.id, 'drawing');
    }
    
    setShowCrystalBalls(true);
  };

  const handleEnhancedAnimationComplete = async (winners: string[]) => {
    console.log('Enhanced animation completed with winners:', winners);
    
    if (activeDraw && updateDrawStatus) {
      await updateDrawStatus(activeDraw.id, 'revealing', winners);
    }
    
    await handleAnimationComplete(winners);
  };

  const handleEnhancedWinnerRevealClose = async () => {
    if (activeDraw && completeDraw) {
      await completeDraw(activeDraw.id);
    }
    
    closeWinnerReveal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
      {!isAdmin && <LiveUserMonitor />}
      <LotteryHeader currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <PageRenderer
        currentPage={currentPage}
        isAdmin={isAdmin}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        adminLogin={adminLogin}
        customers={customers}
        events={events}
        winners={winners}
        draws={draws}
        externalLinks={externalLinks}
        conductDraw={conductDraw}
        isDrawing={isDrawing}
        setIsAdmin={setIsAdmin}
        setCurrentPage={setCurrentPage}
      />
      
      <LotteryFooter />
      
      <LotteryOverlays
        showUserCountdown={false} // Now handled by real-time system
        countdownDuration={10}
        onCountdownComplete={handleCountdownComplete}
        onCountdownCancel={() => {}} // Will be handled by admin controls
        showCrystalBalls={showCrystalBalls}
        events={events}
        participants={customers.map(c => c.name)}
        onAnimationComplete={handleEnhancedAnimationComplete}
        showWinnerReveal={showWinnerReveal}
        currentWinners={currentWinners}
        currentPrizes={currentPrizes}
        onWinnerRevealClose={handleEnhancedWinnerRevealClose}
        onWinnerRevealBack={goBackToDraw}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Index;
