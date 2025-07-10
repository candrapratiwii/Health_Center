import React, { useState, useEffect } from 'react';
import { Home, Calendar, Clock, User, LogOut, Menu, ChevronLeft } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/patien/dashboard' },
  { id: 'booking', label: 'Buat Reservasi', icon: Calendar, path: '/patien/booking' },
  { id: 'appointments', label: 'Reservasi Saya', icon: Clock, path: '/patien/appointments' }
];

const ResponsiveSidenav = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavClick = (itemId) => {
    setActiveItem(itemId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 bg-gradient-to-b from-teal-500 via-cyan-500 to-blue-500 shadow-xl
          ${isMobile ? (isOpen ? 'w-72' : 'w-0') : isCollapsed ? 'w-20' : 'w-72'}
        `}
        style={{ overflow: 'hidden' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSidebar}
                className="md:hidden mr-2 p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition"
              >
                <Menu size={24} />
              </button>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              {!isCollapsed && (
                <div className="text-white">
                  <h1 className="font-bold text-base">Puskesmas</h1>
                  <p className="text-white/80 text-xs">Sistem Reservasi</p>
                </div>
              )}
            </div>
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <ChevronLeft 
                  size={20} 
                  className={`text-white transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon size={22} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium transition-all duration-200">
                      {item.label}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 min-h-screen
          ${isMobile ? (isOpen ? 'ml-72' : 'ml-0') : isCollapsed ? 'ml-20' : 'ml-72'}
        `}
      >
        {/* Hamburger button for desktop (hidden on mobile) */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute top-6 left-6 z-50 p-2 bg-white/80 rounded-lg shadow hover:bg-white"
          >
            <Menu size={24} />
          </button>
        )}
        {/* Main Content */}
        <div className="p-4 md:p-6">
          {children || <div className="text-gray-700">Konten utama di sini</div>}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveSidenav; 