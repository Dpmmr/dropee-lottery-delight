import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Play, Users, Trophy, BarChart3, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLiveMonitoring } from '@/hooks/useLiveMonitoring';
import { useRealTimeDraws } from '@/hooks/useRealTimeDraws';
import type { Customer, Event, Winner, Draw, ExternalLink } from '@/types/lottery';
import { QueryClient } from '@tanstack/react-query';
import AdminDrawControls from './AdminDrawControls';

interface AdminPageProps {
  customers: Customer[];
  events: Event[];
  winners: Winner[];
  draws: Draw[];
  externalLinks: ExternalLink[];
  conductDraw: (eventId: string, prizeDescription: string, prizes: string[]) => void;
  isDrawing: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  setCurrentPage: (page: string) => void;
  queryClient: QueryClient;
}

const AdminPage: React.FC<AdminPageProps> = ({
  customers,
  events,
  winners,
  draws,
  externalLinks,
  conductDraw,
  isDrawing,
  setIsAdmin,
  setCurrentPage,
  queryClient
}) => {
  const { onlineUsers, peakUsers } = useLiveMonitoring();
  
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
  const [newEvent, setNewEvent] = useState({ name: '', winners_count: 3, event_date: '', active: false });
  const [newLink, setNewLink] = useState({ name: '', url: '' });
  const [prizes, setPrizes] = useState(['Free Delivery for 7 Days', 'Free Delivery for 3 Days', '10% Discount Next Order']);
  const [countdownDuration, setCountdownDuration] = useState(10);

  const addCustomer = async () => {
    if (newCustomer.name && newCustomer.phone && newCustomer.email) {
      try {
        const { error } = await supabase.from('customers').insert(newCustomer);
        if (error) {
          console.error('Error adding customer:', error);
          alert('Error adding customer: ' + error.message);
        } else {
          setNewCustomer({ name: '', phone: '', email: '' });
          queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        alert('Unexpected error occurred');
      }
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer? This will also delete all their winner records.')) {
      return;
    }

    try {
      // First delete associated winners
      const { error: winnersError } = await supabase
        .from('winners')
        .delete()
        .eq('customer_id', id);

      if (winnersError) {
        console.error('Error deleting winner records:', winnersError);
        alert('Error deleting customer winner records: ' + winnersError.message);
        return;
      }

      // Then delete the customer
      const { error: customerError } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (customerError) {
        console.error('Error deleting customer:', customerError);
        alert('Error deleting customer: ' + customerError.message);
      } else {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        queryClient.invalidateQueries({ queryKey: ['winners'] });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Unexpected error occurred while deleting customer');
    }
  };

  const addEvent = async () => {
    if (newEvent.name && newEvent.winners_count && newEvent.event_date) {
      try {
        const { error } = await supabase.from('events').insert(newEvent);
        if (error) {
          console.error('Error adding event:', error);
          alert('Error adding event: ' + error.message);
        } else {
          setNewEvent({ name: '', winners_count: 3, event_date: '', active: false });
          queryClient.invalidateQueries({ queryKey: ['events'] });
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        alert('Unexpected error occurred');
      }
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      // Check if event has associated data
      const eventHasWinners = winners.some(w => w.event_id === id);
      const eventHasDraws = draws.some(d => d.event_id === id);
      
      if (eventHasWinners || eventHasDraws) {
        const confirmCascade = confirm(
          'This event has associated winner records and/or draws. Do you want to delete everything including all winners and draws? This action cannot be undone.'
        );
        
        if (!confirmCascade) {
          return;
        }

        // Delete in proper order due to foreign key constraints
        if (eventHasWinners) {
          const { error: winnersError } = await supabase
            .from('winners')
            .delete()
            .eq('event_id', id);

          if (winnersError) {
            console.error('Error deleting winners:', winnersError);
            alert('Error deleting winner records: ' + winnersError.message);
            return;
          }
        }

        if (eventHasDraws) {
          const { error: drawsError } = await supabase
            .from('draws')
            .delete()
            .eq('event_id', id);

          if (drawsError) {
            console.error('Error deleting draws:', drawsError);
            alert('Error deleting draw records: ' + drawsError.message);
            return;
          }
        }
      }

      // Delete the event
      const { error: eventError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (eventError) {
        console.error('Error deleting event:', eventError);
        alert('Error deleting event: ' + eventError.message);
      } else {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['winners'] });
        queryClient.invalidateQueries({ queryKey: ['draws'] });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Unexpected error occurred while deleting event');
    }
  };

  const toggleEventActive = async (id: string, active: boolean) => {
    try {
      // First deactivate all events
      await supabase.from('events').update({ active: false }).neq('id', '');
      // Then activate the selected one if needed
      if (active) {
        await supabase.from('events').update({ active: true }).eq('id', id);
      }
      queryClient.invalidateQueries({ queryKey: ['events'] });
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Error updating event');
    }
  };

  const addLink = async () => {
    if (newLink.name && newLink.url) {
      try {
        const { error } = await supabase.from('external_links').insert(newLink);
        if (error) {
          console.error('Error adding link:', error);
          alert('Error adding link: ' + error.message);
        } else {
          setNewLink({ name: '', url: '' });
          queryClient.invalidateQueries({ queryKey: ['external_links'] });
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        alert('Unexpected error occurred');
      }
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase.from('external_links').delete().eq('id', id);
      if (error) {
        console.error('Error deleting link:', error);
        alert('Error deleting link: ' + error.message);
      } else {
        queryClient.invalidateQueries({ queryKey: ['external_links'] });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Unexpected error occurred');
    }
  };

  const handleEnhancedCountdownDraw = async (eventId: string) => {
    try {
      console.log('Starting enhanced countdown draw for event:', eventId);
      
      if (startCountdownDraw) {
        await startCountdownDraw(
          eventId, 
          prizes.slice(0, events.find(e => e.id === eventId)?.winners_count || 3),
          countdownDuration,
          customers.length
        );
      }
    } catch (err) {
      console.error('Error starting enhanced countdown draw:', err);
      alert('Error starting draw: ' + err);
    }
  };

  const handleStopDraw = async () => {
    try {
      if (activeDraw && completeDraw) {
        await completeDraw(activeDraw.id);
      }
    } catch (err) {
      console.error('Error stopping draw:', err);
      alert('Error stopping draw: ' + err);
    }
  };

  const addPrize = () => {
    setPrizes([...prizes, '']);
  };

  const removePrize = (index: number) => {
    if (prizes.length > 1) {
      setPrizes(prizes.filter((_, i) => i !== index));
    }
  };

  const updatePrize = (index: number, value: string) => {
    const newPrizes = [...prizes];
    newPrizes[index] = value;
    setPrizes(newPrizes);
  };

  const getPrizeLabel = (index: number) => {
    if (index === 0) return '🥇 First Prize:';
    if (index === 1) return '🥈 Second Prize:';
    if (index === 2) return '🥉 Third Prize:';
    return `🏆 Prize ${index + 1}:`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ⚙️ Admin Panel
          </h2>
          <button
            onClick={() => {setIsAdmin(false); setCurrentPage('home');}}
            className="bg-red-500 hover:bg-red-600 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
          >
            Logout
          </button>
        </div>

        {/* Live Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 md:p-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Users className="w-4 h-4 md:w-8 md:h-8" />
              <div>
                <p className="text-xs md:text-sm opacity-80">Live</p>
                <p className="text-lg md:text-2xl font-bold">{onlineUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-3 md:p-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <BarChart3 className="w-4 h-4 md:w-8 md:h-8" />
              <div>
                <p className="text-xs md:text-sm opacity-80">Peak</p>
                <p className="text-lg md:text-2xl font-bold">{peakUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 md:p-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Trophy className="w-4 h-4 md:w-8 md:h-8" />
              <div>
                <p className="text-xs md:text-sm opacity-80">Draws</p>
                <p className="text-lg md:text-2xl font-bold">{draws.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-3 md:p-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Users className="w-4 h-4 md:w-8 md:h-8" />
              <div>
                <p className="text-xs md:text-sm opacity-80">Winners</p>
                <p className="text-lg md:text-2xl font-bold">{winners.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Enhanced Draw Controls - New Section */}
          <AdminDrawControls
            customers={customers}
            events={events}
            prizes={prizes}
            countdownDuration={countdownDuration}
          />

          {/* Customers Management */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-4 md:p-6 shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold mb-4">👥 Customers ({customers.length})</h3>
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="w-full px-3 md:px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
              />
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                />
              </div>
              <button
                onClick={addCustomer}
                className="w-full bg-green-500 hover:bg-green-600 px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span>Add Customer</span>
              </button>
            </div>
            <div className="max-h-48 md:max-h-64 overflow-y-auto space-y-2">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white/20 p-3 md:p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm md:text-base">{customer.name}</p>
                    <p className="text-xs md:text-sm text-cyan-200">{customer.phone}</p>
                  </div>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Events Management & Prize Configuration */}
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-4 md:p-6 shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold mb-4">🎯 Events & Prize Configuration</h3>
            
            {/* Prize Configuration */}
            <div className="bg-white/10 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold">🏆 Prize Configuration</h4>
                <button
                  onClick={addPrize}
                  className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Prize</span>
                </button>
              </div>
              <div className="space-y-3">
                {prizes.map((prize, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">{getPrizeLabel(index)}</label>
                      <input
                        type="text"
                        value={prize}
                        onChange={(e) => updatePrize(index, e.target.value)}
                        className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white text-sm"
                        placeholder={`Prize ${index + 1} description`}
                      />
                    </div>
                    {prizes.length > 1 && (
                      <button
                        onClick={() => removePrize(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enhanced Countdown Controls */}
            <div className="bg-white/10 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <h4 className="text-lg font-semibold mb-2">⚡ Enhanced Draw Countdown</h4>
              <div className="flex items-center space-x-2 md:space-x-4">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={countdownDuration}
                  onChange={(e) => setCountdownDuration(parseInt(e.target.value))}
                  className="w-20 px-2 py-1 bg-white/20 rounded border border-white/30 text-white text-sm md:text-base"
                />
                <span className="text-sm md:text-base">seconds with enhanced animations</span>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <input
                type="text"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                className="w-full px-3 md:px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
              />
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Number of Winners"
                  value={newEvent.winners_count}
                  onChange={(e) => setNewEvent({...newEvent, winners_count: parseInt(e.target.value)})}
                  className="w-full px-3 md:px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                />
                <input
                  type="date"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                />
              </div>
              <button
                onClick={addEvent}
                className="w-full bg-green-500 hover:bg-green-600 px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span>Add Event</span>
              </button>
            </div>

            <div className="space-y-2">
              {events.map(event => (
                <div key={event.id} className="bg-white/20 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 space-y-2 md:space-y-0">
                    <h4 className="font-semibold text-sm md:text-base">{event.name}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleEventActive(event.id, !event.active)}
                        className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm ${event.active ? 'bg-green-500' : 'bg-gray-500'}`}
                      >
                        {event.active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-cyan-200 mb-2">{event.winners_count} winners • {event.event_date}</p>
                  {event.active && !activeDraw && (
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                      <button
                        onClick={() => conductDraw(event.id, 'Manual Draw', prizes)}
                        disabled={isDrawing || customers.length === 0}
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:bg-gray-500 px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs md:text-sm"
                      >
                        <Play className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Quick Start</span>
                      </button>
                      <button
                        onClick={() => handleEnhancedCountdownDraw(event.id)}
                        disabled={isDrawing || customers.length === 0}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:bg-gray-500 px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs md:text-sm"
                      >
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Enhanced Draw</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* External Links Management */}
          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-4 md:p-6 shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold mb-4">🔗 External Links</h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <input
                  type="text"
                  placeholder="Link Name"
                  value={newLink.name}
                  onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                />
                <button
                  onClick={addLink}
                  className="w-full bg-green-500 hover:bg-green-600 px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Add Link</span>
                </button>
              </div>
              <div className="space-y-2">
                {externalLinks.map(link => (
                  <div key={link.id} className="bg-white/20 p-3 md:p-4 rounded-lg flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm md:text-base">{link.name}</p>
                      <p className="text-xs md:text-sm text-cyan-200 truncate">{link.url}</p>
                    </div>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
