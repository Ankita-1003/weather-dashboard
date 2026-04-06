import React, { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { 
  Thermometer, 
  Moon, 
  Sun, 
  Trash2, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  const { unit, toggleUnit, theme, toggleTheme, locationName } = useContext(WeatherContext);

  const sections = [
    {
      title: "General Preferences",
      items: [
        {
          icon: Globe,
          label: "Temperature Unit",
          desc: "Switch between Metric and Imperial measurements.",
          action: (
            <button 
              onClick={toggleUnit}
              className="px-4 py-2 bg-accent-yellow/10 border border-accent-yellow/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-accent-yellow hover:bg-accent-yellow/20 transition-all"
            >
              {unit === "celsius" ? "Celsius (°C)" : "Fahrenheit (°F)"}
            </button>
          )
        },
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: "Visual Theme",
          desc: "Toggle between high-contrast dark and light modes.",
          action: (
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-white/5 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 hover:bg-black/10 transition-all"
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          )
        }
      ]
    },
    {
      title: "Location Services",
      items: [
        {
          icon: MapPin,
          label: "Primary Location",
          desc: `Currently displaying: ${locationName}`,
          action: <ChevronRight size={18} className="text-slate-500" />
        },
        {
          icon: ShieldCheck,
          label: "Geolocation Privacy",
          desc: "Control browser GPS access permissions.",
          action: <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
        }
      ]
    },
    {
      title: "System & Cache",
      items: [
        {
          icon: Trash2,
          label: "Reset Dashboard",
          desc: "Clear saved coordinates and location history from memory.",
          action: (
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/20 transition-all"
            >
              Clear Data
            </button>
          )
        }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10 md:gap-14 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-text-main">
          System Configuration
        </h1>
        <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">
          Personalize your climate monitoring experience
        </p>
      </header>

      <div className="flex flex-col gap-12">
        {sections.map((section, sIdx) => (
          <section key={sIdx} className="flex flex-col gap-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-yellow pl-1">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {section.items.map((item, iIdx) => (
                <motion.div
                  key={iIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (sIdx * 0.1) + (iIdx * 0.05) }}
                  className="panel-glass p-6 md:p-8 flex items-center justify-between group hover:border-white/10 transition-all overflow-visible"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-3.5 bg-white/5 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5 text-text-muted group-hover:text-accent-yellow transition-colors">
                      <item.icon size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-text-main leading-tight tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                        {item.label}
                      </span>
                      <span className="text-[10px] md:text-xs font-medium text-slate-500 mt-1 max-w-[200px] md:max-w-none">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {item.action}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Settings;
