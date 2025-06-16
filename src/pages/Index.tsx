
import React, { useState, useEffect } from 'react';
import LotteryHeader from '../components/LotteryHeader';
import HomePage from '../components/HomePage';
import ContactPage from '../components/ContactPage';
import WinnersPage from '../components/WinnersPage';
import AdminLoginPage from '../components/AdminLoginPage';
import AdminPage from '../components/AdminPage';
import LotteryFooter from '../components/LotteryFooter';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', phone: '1234567890', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', phone: '0987654321', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', phone: '1112223333', email: 'mike@example.com' },
    { id: 4, name: 'Sarah Williams', phone: '4445556666', email: 'sarah@example.com' },
    { id: 5, name: 'David Brown', phone: '7778889999', email: 'david@example.com' },
  ]);
  const [allWinners, setAllWinners] = useState([
    { id: 1, name: 'Alice Cooper', date: '2024-06-10', event: 'Weekly Draw #1' },
    { id: 2, name: 'Bob Dylan', date: '2024-06-10', event: 'Weekly Draw #1' },
    { id: 3, name: 'Charlie Brown', date: '2024-06-10', event: 'Weekly Draw #1' },
    { id: 4, name: 'Diana Prince', date: '2024-06-03', event: 'Special Event' },
    { id: 5, name: 'Elvis Presley', date: '2024-06-03', event: 'Special Event' },
  ]);
  const [events, setEvents] = useState([
    { id: 1, name: 'Weekly Draw', winners: 3, date: '2024-06-17', active: true },
    { id: 2, name: 'Special Event', winners: 2, date: '2024-06-24', active: false },
  ]);
  const [externalLinks, setExternalLinks] = useState([
    { id: 1, name: 'DROPEE Main Site', url: 'https://dropee.com' },
    { id: 2, name: 'DROPEE Store', url: 'https://store.dropee.com' },
  ]);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
  const [newEvent, setNewEvent] = useState({ name: '', winners: 3, date: '' });
  const [newLink, setNewLink] = useState({ name: '', url: '' });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinners, setCurrentWinners] = useState([]);
  const [drawAnimation, setDrawAnimation] = useState(false);

  const adminLogin = () => {
    if (adminPassword === '000000') {
      setIsAdmin(true);
      setCurrentPage('admin');
      setAdminPassword('');
    } else {
      alert('Invalid password!');
    }
  };

  const addCustomer = () => {
    if (newCustomer.name && newCustomer.phone && newCustomer.email) {
      setCustomers([...customers, { 
        id: Date.now(), 
        ...newCustomer 
      }]);
      setNewCustomer({ name: '', phone: '', email: '' });
    }
  };

  const addEvent = () => {
    if (newEvent.name && newEvent.winners && newEvent.date) {
      setEvents([...events, { 
        id: Date.now(), 
        ...newEvent,
        active: false
      }]);
      setNewEvent({ name: '', winners: 3, date: '' });
    }
  };

  const addLink = () => {
    if (newLink.name && newLink.url) {
      setExternalLinks([...externalLinks, { 
        id: Date.now(), 
        ...newLink 
      }]);
      setNewLink({ name: '', url: '' });
    }
  };

  const conductDraw = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event || customers.length === 0) return;

    setIsDrawing(true);
    setDrawAnimation(true);

    setTimeout(() => {
      const shuffled = [...customers].sort(() => 0.5 - Math.random());
      const winners = shuffled.slice(0, event.winners);
      
      const newWinners = winners.map(winner => ({
        id: Date.now() + Math.random(),
        name: winner.name,
        date: new Date().toISOString().split('T')[0],
        event: event.name
      }));

      setCurrentWinners(newWinners);
      setAllWinners([...allWinners, ...newWinners]);
      setIsDrawing(false);
      setDrawAnimation(false);
    }, 3000);
  };

  const renderCurrentPage = () => {
    if (isAdmin) {
      return (
        <AdminPage
          customers={customers}
          setCustomers={setCustomers}
          events={events}
          setEvents={setEvents}
          externalLinks={externalLinks}
          setExternalLinks={setExternalLinks}
          newCustomer={newCustomer}
          setNewCustomer={setNewCustomer}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          newLink={newLink}
          setNewLink={setNewLink}
          addCustomer={addCustomer}
          addEvent={addEvent}
          addLink={addLink}
          conductDraw={conductDraw}
          isDrawing={isDrawing}
          setIsAdmin={setIsAdmin}
          setCurrentPage={setCurrentPage}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            currentWinners={currentWinners}
            customers={customers}
            allWinners={allWinners}
            events={events}
            drawAnimation={drawAnimation}
          />
        );
      case 'contact':
        return <ContactPage externalLinks={externalLinks} />;
      case 'winners':
        return <WinnersPage allWinners={allWinners} />;
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
            currentWinners={currentWinners}
            customers={customers}
            allWinners={allWinners}
            events={events}
            drawAnimation={drawAnimation}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
      <LotteryHeader currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderCurrentPage()}
      <LotteryFooter />
    </div>
  );
};

export default Index;
