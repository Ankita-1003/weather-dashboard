import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WeatherContext } from "../context/WeatherContext";
import LocationSearch from "./LocationSearch";
import UserDropdown from "./UserDropdown";
import { 
  LayoutDashboard, 
  CloudSun, 
  User, 
  LineChart,
  Sun,
  Moon,
  Search,
  Settings as SettingsIcon
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme, locationName } = useContext(WeatherContext);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const topNavItems = [
    { path: "/", label: "DASHBOARD" },
    { path: "/history", label: "HISTORY" },
    { path: "/settings", label: "SETTINGS" },
  ];

  const bottomNavItems = [
    { path: "/",        icon: LayoutDashboard, label: "Dashboard" },
    { path: "/history", icon: LineChart,        label: "History"   },
    { path: "/settings",icon: SettingsIcon,     label: "Settings"  },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${theme === 'dark' ? 'bg-[#131427]' : 'bg-[#f8fafc]'}`}>
      
      {/* Top Header Navigation */}
      <header className="h-16 md:h-20 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 md:px-12 backdrop-blur-2xl sticky top-0 z-50 dark:bg-[#131427]/80">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-accent-yellow/10 rounded-lg md:rounded-xl border border-accent-yellow/20 shadow-[0_0_20px_rgba(255,214,10,0.1)]">
            <CloudSun className="w-5 h-5 md:w-7 md:h-7 text-accent-yellow" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm md:text-xl tracking-tighter leading-none text-text-main">CLIMATE</span>
            <span className="font-bold text-[10px] md:text-sm text-text-muted leading-none">{locationName || "MASTER"}</span>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center px-12">
           <LocationSearch />
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {topNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`text-xs font-black tracking-widest relative py-1 transition-colors duration-300 ${
                  isActive ? "text-accent-yellow" : "text-text-muted hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="top-nav-pill"
                    className="absolute -bottom-4 left-0 right-0 h-1 bg-accent-yellow rounded-full shadow-[0_0_15px_rgba(255,214,10,0.5)]" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2.5 bg-white/5 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 hover:bg-black/10 transition-all text-text-main"
          >
            <Search size={18} />
          </button>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="hidden sm:block p-2.5 bg-white/5 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 text-text-main"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>


          <div className="relative flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-black/10 dark:border-white/10 group cursor-pointer">
            <button 
              onClick={() => setIsUserOpen(!isUserOpen)}
              className="p-1.5 md:p-2.5 bg-white/5 dark:bg-black/20 rounded-full border border-black/5 dark:border-white/10 transition-all hover:bg-black/5 dark:hover:bg-white/10 group-hover:scale-110 duration-500"
            >
               <User size={16} className="text-text-muted dark:text-slate-300 group-hover:text-white" />
            </button>
            <UserDropdown isOpen={isUserOpen} onClose={() => setIsUserOpen(false)} />
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-bg-panel/95 backdrop-blur-2xl border-b border-black/5 dark:border-white/10 z-40 sticky top-16 md:top-20"
          >
            <div className="p-4">
               <LocationSearch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-12 py-4 md:py-8 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-bg-panel/90 backdrop-blur-3xl border-t border-black/5 dark:border-white/5 md:hidden flex items-center justify-around px-2 z-50">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${
                isActive ? "text-accent-yellow font-black" : "text-text-muted font-bold hover:text-white"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? "bg-accent-yellow/10" : ""}`}>
                <item.icon size={20} className={isActive ? "text-accent-yellow" : ""} />
              </div>
              <span className="text-[9px] uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
