
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import HomePage from './HomePage';
import ContactPage from './ContactPage';
import WinnersPage from './WinnersPage';
import AdminLoginPage from './AdminLoginPage';
import AdminPage from './AdminPage';
import type { Customer, Event, Winner, Draw, ExternalLink } from '@/types/lottery';

interface PageRendererProps {
  currentPage: string;
  isAdmin: boolean;
  adminPassword: string;
  setAdminPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  adminLogin: () => void;
  customers: Customer[];
  events: Event[];
  winners: Winner[];
  draws: Draw[];
  externalLinks: ExternalLink[];
  conductDraw: (eventId: string, prizeDescription: string, prizes: string[]) => Promise<void>;
  isDrawing: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  setCurrentPage: (page: string) => void;
}

const PageRenderer: React.FC<PageRendererProps> = ({
  currentPage,
  isAdmin,
  adminPassword,
  setAdminPassword,
  showPassword,
  setShowPassword,
  adminLogin,
  customers,
  events,
  winners,
  draws,
  externalLinks,
  conductDraw,
  isDrawing,
  setIsAdmin,
  setCurrentPage
}) => {
  const queryClient = useQueryClient();

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

export default PageRenderer;
