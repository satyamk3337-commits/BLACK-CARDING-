import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Tag, Gift } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroSectionProps {
  settings: StoreSettings;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onExploreClick }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-8 px-4 sm:px-6">
      {/* Background Glow & Radial Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-700/20 via-purple-600/20 to-emerald-600/15 blur-[120px] pointer-events-none rounded-full" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Instant Digital Voucher Delivery Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Gift className="w-3.5 h-3.5 text-emerald-400" />
          <span>OFFICIAL DIGITAL VOUCHERS & CODES</span>
        </div>

        {/* Big Brand Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase mb-1">
          <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            {settings.storeName || 'VoucherHub'}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-medium text-indigo-400 tracking-wide mb-4">
          वाउचर हब • {settings.subTitle || 'Digital Gift Card & Voucher Marketplace'}
        </p>

        {/* Pitch */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl leading-tight mb-4">
          Genuine Brand Vouchers, Game Credits & Digital Passes
        </h2>

        {/* Subtitle description */}
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mb-7 leading-relaxed">
          Get verified promo codes and discount vouchers for Amazon, Steam, Google Play, Netflix, Flipkart, and more. Instant delivery upon payment confirmation.
        </p>

        {/* Explore Marketplace CTA */}
        <button
          id="hero-explore-btn"
          onClick={onExploreClick}
          className="group relative inline-flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Tag className="w-4 h-4 text-emerald-300" />
          <span>EXPLORE VOUCHERS</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 w-full max-w-2xl">
          <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
            <span className="text-lg sm:text-2xl font-black text-indigo-300 tracking-tight">
              100%
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">
              GENUINE CODES
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
            <span className="text-lg sm:text-2xl font-black text-emerald-400 tracking-tight">
              INSTANT
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">
              DELIVERY ON PAID
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
            <span className="text-lg sm:text-2xl font-black text-purple-300 tracking-tight">
              UP TO 25%
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">
              EXCLUSIVE SAVINGS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
