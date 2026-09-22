import React from 'react';
import { Send, ShieldCheck, Lock } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenSupport,
  onOpenAdmin,
}) => {
  return (
    <>
      <footer className="w-full bg-[#070810] border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          {/* Brand Left */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center font-black text-[10px] text-white">
                DC
              </div>
              <span className="font-extrabold text-white tracking-wider">
                {settings.storeName || 'DARK CARDING'}
              </span>
            </div>

            <span className="text-gray-600 hidden sm:inline">•</span>

            <button
              onClick={onOpenSupport}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold hover:border-indigo-400 transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Telegram Support: @{settings.telegramUsername || 'lottaygent'}</span>
            </button>
          </div>

          {/* Copyright & Security Right */}
          <div className="flex flex-col md:items-end gap-1 text-[11px] text-gray-500 text-center md:text-right">
            <div>
              © 2026 {settings.storeName || 'DARK CARDING'}. All rights reserved.
            </div>
            <div className="flex items-center justify-center md:justify-end gap-2 text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Virtual Balance Cards & Vouchers</span>
              <span>•</span>
              <button
                onClick={onOpenAdmin}
                className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline text-[11px] flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Login</span>
              </button>
              <span>•</span>
              <a
                href="/dark_carding_all_in_one.html"
                target="_blank"
                rel="noreferrer"
                download="dark_carding_all_in_one.html"
                className="text-emerald-400 hover:text-emerald-300 font-bold underline text-[11px] flex items-center gap-1"
                title="Download complete single-file version of the website"
              >
                <span>📥 Single-File HTML</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
