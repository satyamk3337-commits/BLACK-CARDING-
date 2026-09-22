import React from 'react';
import { ShoppingBag, Headphones, Lock, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeaderProps {
  ordersCount: number;
  settings: StoreSettings;
  onOpenOrders: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  onScrollToCatalog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  ordersCount,
  settings,
  onOpenOrders,
  onOpenSupport,
  onOpenAdmin,
  onScrollToCatalog,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0c0d16]/95 backdrop-blur-md">
      {settings.announcementEnabled && settings.announcementBanner && (
        <div className="bg-gradient-to-r from-emerald-950/70 via-indigo-950/70 to-purple-950/70 border-b border-emerald-500/20 px-4 py-1.5 text-center text-xs text-emerald-200 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
          <span className="truncate font-medium">{settings.announcementBanner}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo - DARK CARDING (DC badge) */}
        <div 
          onClick={onScrollToCatalog}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="header-brand-logo"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 flex items-center justify-center font-black text-xs text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400/30 group-hover:scale-105 transition-transform">
            DC
          </div>
          <div className="flex items-center gap-1.5 font-black text-base sm:text-lg tracking-wider">
            <span className="text-white">DARK</span>
            <span className="text-indigo-400">CARDING</span>
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* User status chip: Raja */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium">
            <span className="text-indigo-400 font-bold">👤 Raja</span>
            <span className="text-gray-500 text-[10px]">↳</span>
          </div>

          {/* My Orders Button */}
          <button
            id="header-my-orders-btn"
            onClick={onOpenOrders}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-xs font-bold text-purple-200 transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)] hover:border-purple-400 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="tracking-wider uppercase text-[11px]">MY ORDERS</span>
            {ordersCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-purple-500 text-white text-[9px] font-black">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Support Button */}
          <button
            id="header-support-btn"
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/50 hover:bg-blue-900/60 border border-blue-500/40 text-xs font-bold text-blue-300 transition-all hover:border-blue-400 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="uppercase text-[11px] font-bold">SUPPORT</span>
          </button>

          {/* Admin Control Button */}
          <button
            id="header-admin-btn"
            onClick={onOpenAdmin}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-amber-400 transition-all cursor-pointer"
            title="Admin Login"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
