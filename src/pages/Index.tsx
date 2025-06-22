
import React from 'react';
import LotteryHeader from '../components/LotteryHeader';
import LotteryFooter from '../components/LotteryFooter';
import LiveUserMonitor from '../components/LiveUserMonitor';
import LotteryOverlays from '../components/LotteryOverlays';
import PageRenderer from '../components/PageRenderer';
import { usePageState } from '../hooks/usePageState';
import { useCountdown } from '../hooks/useCountdown';
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

  const {
    showUserCountdown,
    setShowUserCountdown,
    countdownDuration,
    currentPrizes,
    setCurrentPrizes,
    handleUserCountdownComplete
  } = useCountdown(isAdmin);

  const {
    isDrawing,
    showCrystalBalls,
    setShowCrystalBalls,
    showWinnerReveal,
    currentWinners,
    currentPrizes: drawCurrentPrizes,
    conductDraw,
    handleAnimationComplete,
    closeWinnerReveal,
    goBackToDraw
  } = useDrawLogic(customers, events);

  const handleCountdownComplete = () => {
    const shouldStartCrystalBalls = handleUserCountdownComplete();
    if (shouldStartCrystalBalls) {
      setShowCrystalBalls(true);
    }
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
        showUserCountdown={showUserCountdown}
        countdownDuration={countdownDuration}
        onCountdownComplete={handleCountdownComplete}
        onCountdownCancel={() => setShowUserCountdown(false)}
        showCrystalBalls={showCrystalBalls}
        events={events}
        participants={customers.map(c => c.name)}
        onAnimationComplete={handleAnimationComplete}
        showWinnerReveal={showWinnerReveal}
        currentWinners={currentWinners}
        currentPrizes={drawCurrentPrizes}
        onWinnerRevealClose={closeWinnerReveal}
        onWinnerRevealBack={goBackToDraw}
      />
    </div>
  );
};

export default Index;
