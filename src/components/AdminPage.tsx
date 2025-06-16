
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Event {
  id: number;
  name: string;
  winners: number;
  date: string;
  active: boolean;
}

interface ExternalLink {
  id: number;
  name: string;
  url: string;
}

interface AdminPageProps {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  externalLinks: ExternalLink[];
  setExternalLinks: (links: ExternalLink[]) => void;
  newCustomer: { name: string; phone: string; email: string };
  setNewCustomer: (customer: { name: string; phone: string; email: string }) => void;
  newEvent: { name: string; winners: number; date: string };
  setNewEvent: (event: { name: string; winners: number; date: string }) => void;
  newLink: { name: string; url: string };
  setNewLink: (link: { name: string; url: string }) => void;
  addCustomer: () => void;
  addEvent: () => void;
  addLink: () => void;
  conductDraw: (eventId: number) => void;
  isDrawing: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  setCurrentPage: (page: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  customers,
  setCustomers,
  events,
  setEvents,
  externalLinks,
  setExternalLinks,
  newCustomer,
  setNewCustomer,
  newEvent,
  setNewEvent,
  newLink,
  setNewLink,
  addCustomer,
  addEvent,
  addLink,
  conductDraw,
  isDrawing,
  setIsAdmin,
  setCurrentPage
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ⚙️ Admin Panel
          </h2>
          <button
            onClick={() => {setIsAdmin(false); setCurrentPage('home');}}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">👥 Customers</h3>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="w-full px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className="w-full px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                className="w-full px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={addCustomer}
                className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Customer</span>
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white/20 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-cyan-200">{customer.phone}</p>
                  </div>
                  <button
                    onClick={() => setCustomers(customers.filter(c => c.id !== customer.id))}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">🎯 Events</h3>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                className="w-full px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="number"
                placeholder="Number of Winners"
                value={newEvent.winners}
                onChange={(e) => setNewEvent({...newEvent, winners: parseInt(e.target.value)})}
                className="w-full px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="w-full px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={addEvent}
                className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Event</span>
              </button>
            </div>
            <div className="space-y-2">
              {events.map(event => (
                <div key={event.id} className="bg-white/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{event.name}</h4>
                    <button
                      onClick={() => setEvents(events.filter(e => e.id !== event.id))}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-cyan-200 mb-2">{event.winners} winners • {event.date}</p>
                  <button
                    onClick={() => conductDraw(event.id)}
                    disabled={isDrawing}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 px-4 py-2 rounded-lg transition-colors"
                  >
                    {isDrawing ? 'Drawing...' : 'Conduct Draw'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-6 shadow-2xl lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">🔗 External Links</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Link Name"
                  value={newLink.name}
                  onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                  className="w-full px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  className="w-full px-4 py-2 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={addLink}
                  className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Link</span>
                </button>
              </div>
              <div className="space-y-2">
                {externalLinks.map(link => (
                  <div key={link.id} className="bg-white/20 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{link.name}</p>
                      <p className="text-sm text-cyan-200">{link.url}</p>
                    </div>
                    <button
                      onClick={() => setExternalLinks(externalLinks.filter(l => l.id !== link.id))}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
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
