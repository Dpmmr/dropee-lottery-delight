import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LotteryHeader from '../components/LotteryHeader';
import HomePage from '../components/HomePage';
import ContactPage from '../components/ContactPage';
import WinnersPage from '../components/WinnersPage';
import AdminLoginPage from '../components/AdminLoginPage';
import AdminPage from '../components/AdminPage';
import LotteryFooter from '../components/LotteryFooter';
import LiveUserMonitor from '../components/LiveUserMonitor';
import CrystalBallAnimation from '../components/CrystalBallAnimation';
import WinnerReveal from '../components/WinnerReveal';
import DrawCountdown from '../components/DrawCountdown';
import type { Customer, Event, Winner, Draw, ExternalLink } from '@/types/lottery';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showCrystalBalls, setShowCrystalBalls] = useState(false);
  const [showWinnerReveal, setShowWinnerReveal] = useState(false);
  const [currentWinners, setCurrentWinners] = useState<string[]>([]);
  const [currentPrizes, setCurrentPrizes] = useState<string[]>([]);
  const [showUserCountdown, setShowUserCountdown] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(10);

  const queryClient = useQueryClient();
  const countdownChannelRef = useRef<any>(null);
  const isCountdownSubscribedRef = useRef(false);

  // Listen for countdown broadcasts from admin (only for non-admin users)
  useEffect(() => {
    if (!isAdmin && !isCountdownSubscribedRef.current) {
      console.log('Setting up countdown listener for users');
      
      countdownChannelRef.current = supabase
        .channel('lottery-countdown')
        .on('broadcast', { event: 'countdown-start' }, (payload) => {
          console.log('Received countdown broadcast:', payload);
          if (payload.payload) {
            setCountdownDuration(payload.payload.duration || 10);
            setCurrentPrizes(payload.payload.prizes || []);
            setShowUserCountdown(true);
          }
        })
        .subscribe((status) => {
          console.log('User countdown channel status:', status);
          if (status === 'SUBSCRIBED') {
            isCountdownSubscribedRef.current = true;
          } else if (status === 'CLOSED') {
            isCountdownSubscribedRef.current = false;
          }
        });
    }

    // Cleanup when becoming admin or component unmounts
    return () => {
      if (isAdmin && countdownChannelRef.current && isCountdownSubscribedRef.current) {
        console.log('Cleaning up user countdown channel (becoming admin)');
        supabase.removeChannel(countdownChannelRef.current);
        countdownChannelRef.current = null;
        isCountdownSubscribedRef.current = false;
      }
    };
  }, [isAdmin]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownChannelRef.current && isCountdownSubscribedRef.current) {
        console.log('Cleaning up countdown channel on unmount');
        supabase.removeChannel(countdownChannelRef.current);
        countdownChannelRef.current = null;
        isCountdownSubscribedRef.current = false;
      }
    };
  }, []);

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) throw error;
      return data as Customer[];
    },
    staleTime: 30000,
    gcTime: 300000
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw error;
      return data as Event[];
    },
    staleTime: 30000,
    gcTime: 300000
  });

  const { data: winners = [] } = useQuery({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('winners')
        .select(`
          *,
          customer:customers(*),
          event:events(*)
        `)
        .order('won_at', { ascending: false });
      if (error) throw error;
      return data as Winner[];
    },
    staleTime: 15000,
    gcTime: 300000
  });

  const { data: draws = [] } = useQuery({
    queryKey: ['draws'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('draws')
        .select(`
          *,
          event:events(*)
        `)
        .order('conducted_at', { ascending: false });
      if (error) throw error;
      return data as Draw[];
    },
    staleTime: 30000,
    gcTime: 300000
  });

  const { data: externalLinks = [] } = useQuery({
    queryKey: ['external_links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('external_links').select('*');
      if (error) throw error;
      return data as ExternalLink[];
    },
    staleTime: 60000,
    gcTime: 300000
  });

  const adminLogin = () => {
    if (adminPassword === '000000') {
      setIsAdmin(true);
      setCurrentPage('admin');
      setAdminPassword('');
    } else {
      alert('Invalid password!');
    }
  };

  const conductDraw = async (eventId: string, prizeDescription: string, prizes: string[]) => {
    const event = events.find(e => e.id === eventId);
    if (!event || customers.length === 0) return;

    console.log('Conducting draw for event:', eventId, 'with prizes:', prizes);
    setIsDrawing(true);
    setShowCrystalBalls(true);
    setCurrentPrizes(prizes);

    // Record the draw
    await supabase.from('draws').insert({
      event_id: eventId,
      total_participants: customers.length
    });
  };

  const handleAnimationComplete = async (winnerNames: string[]) => {
    console.log('Animation completed with winners:', winnerNames);
    setShowCrystalBalls(false);
    setCurrentWinners(winnerNames);
    setShowWinnerReveal(true);

    // Save winners to database with individual prizes
    const event = events.find(e => e.active);
    if (event) {
      for (let i = 0; i < winnerNames.length; i++) {
        const winnerName = winnerNames[i];
        const customer = customers.find(c => c.name === winnerName);
        if (customer) {
          const prizeDescription = currentPrizes[i] || 'Participation Prize';
          
          await supabase.from('winners').insert({
            customer_id: customer.id,
            event_id: event.id,
            prize_description: prizeDescription
          });
        }
      }
    }

    // Refresh data
    queryClient.invalidateQueries({ queryKey: ['winners'] });
    queryClient.invalidateQueries({ queryKey: ['draws'] });
  };

  const closeWinnerReveal = () => {
    setShowWinnerReveal(false);
    setIsDrawing(false);
    setCurrentWinners([]);
    setCurrentPrizes([]);
  };

  const goBackToDraw = () => {
    setShowWinnerReveal(false);
    setShowCrystalBalls(true);
  };

  const handleUserCountdownComplete = () => {
    console.log('User countdown completed');
    setShowUserCountdown(false);
    setShowCrystalBalls(true);
  };

  const renderCurrentPage = () => {
    if (isAdmin) {
      return (
        <AdminPage
          customers={customers}
          events={events}
          winners={winners}
          draws={draws}
          externalLinks={externalLinks}
          conductDraw={conductDraw}
          isDrawing={isDrawing}
          setIsAdmin={setIsAdmin}
          setCurrentPage={setCurrentPage}
          queryClient={queryClient}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            currentWinners={winners.slice(0, 3)}
            customers={customers}
            allWinners={winners}
            events={events}
            draws={draws}
          />
        );
      case 'contact':
        return <ContactPage externalLinks={externalLinks} />;
      case 'winners':
        return <WinnersPage allWinners={winners} />;
      case 'admin-login':
        return (
          <AdminLoginPage
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            adminLogin={adminLogin}
          />
        );
      default:
        return (
          <HomePage
            currentWinners={winners.slice(0, 3)}
            customers={customers}
            allWinners={winners}
            events={events}
            draws={draws}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
      {!isAdmin && <LiveUserMonitor />}
      <LotteryHeader currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderCurrentPage()}
      <LotteryFooter />
      
      {showUserCountdown && (
        <DrawCountdown
          duration={countdownDuration}
          onComplete={handleUserCountdownComplete}
          onCancel={() => setShowUserCountdown(false)}
        />
      )}
      
      {showCrystalBalls && (
        <CrystalBallAnimation
          winnersCount={events.find(e => e.active)?.winners_count || 3}
          onAnimationComplete={handleAnimationComplete}
          participants={customers.map(c => c.name)}
        />
      )}
      
      {showWinnerReveal && (
        <WinnerReveal
          winners={currentWinners}
          prizes={currentPrizes}
          onClose={closeWinnerReveal}
          onBack={goBackToDraw}
        />
      )}
    </div>
  );
};

export default Index;
