import React, { useState, useEffect } from "react";
import { 
  BarChart3, RefreshCw, Compass, ShieldCheck, Sparkles, 
  Layers3, ShieldAlert, BadgeInfo, Terminal, Database, HelpCircle
} from "lucide-react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import { SystemStats } from "./types";

export default function App() {
  const [view, setView] = useState<"landing" | "dashboard" | "admin">("landing");
  const [stats, setStats] = useState<SystemStats | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats periodically
    const timer = setInterval(fetchStats, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-forest text-cream font-sans antialiased selection:bg-gold selection:text-forest">
      
      {/* GLOBAL NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-forest/80 border-b border-stone/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => setView("landing")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-sage/30 border border-stone/30 flex items-center justify-center group-hover:bg-sage/50 transition-colors">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-cream block">
                RESEARCHPRO
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest block -mt-1 text-gold/80">
                AI Business Agent
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1 p-0.5 bg-forest/60 border border-stone/30 rounded-lg">
            <button
              id="nav-btn-landing"
              onClick={() => setView("landing")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                view === "landing" 
                  ? "bg-sage text-cream border border-stone/50 shadow-sm"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              Overview
            </button>
            <button
              id="nav-btn-dashboard"
              onClick={() => setView("dashboard")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                view === "dashboard" 
                  ? "bg-sage text-cream border border-stone/50 shadow-sm"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              Scraper Dashboard
            </button>
            <button
              id="nav-btn-admin"
              onClick={() => setView("admin")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                view === "admin" 
                  ? "bg-sage text-cream border border-stone/50 shadow-sm"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              System Admin
            </button>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              id="header-cta-sandbox"
              onClick={() => setView("dashboard")}
              className="px-4 py-1.5 bg-gold hover:bg-gold/85 text-forest font-bold rounded-lg text-xs transition-all border border-gold cursor-pointer"
            >
              Run Audit
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE NAVBAR NAV */}
      <div className="md:hidden flex justify-center py-2.5 bg-forest/90 border-b border-stone/30 px-4">
        <div className="flex gap-1.5 p-0.5 bg-forest/60 border border-stone/30 rounded-lg w-full max-w-sm justify-around">
          <button
            onClick={() => setView("landing")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md w-full transition-all ${
              view === "landing" ? "bg-sage text-cream border border-stone/40" : "text-cream/65"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setView("dashboard")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md w-full transition-all ${
              view === "dashboard" ? "bg-sage text-cream border border-stone/40" : "text-cream/65"
            }`}
          >
            Audit Agent
          </button>
          <button
            onClick={() => setView("admin")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md w-full transition-all ${
              view === "admin" ? "bg-sage text-cream border border-stone/40" : "text-cream/65"
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === "landing" && (
          <LandingPage 
            onStartDashboard={() => setView("dashboard")}
            isDarkMode={true}
          />
        )}

        {view === "dashboard" && (
          <Dashboard 
            onSearchInitiated={fetchStats}
            isDarkMode={true}
          />
        )}

        {view === "admin" && (
          <AdminPanel 
            stats={stats}
            onRefresh={fetchStats}
            isDarkMode={true}
          />
        )}

      </main>

    </div>
  );
}
