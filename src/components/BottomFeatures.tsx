import React from 'react';
import { ShieldCheck, Zap, Lock, Send, ArrowRight, Gift, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../types';

interface BottomFeaturesProps {
  settings: StoreSettings;
  onExploreClick: () => void;
  onOpenSupport: () => void;
}

export const BottomFeatures: React.FC<BottomFeaturesProps> = ({
  settings,
  onExploreClick,
  onOpenSupport,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 border-t border-white/5 bg-[#0a0c16]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GENUINE DIGITAL VOUCHER WORKFLOW</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Seamless, Verified & Instant <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Digital Voucher Hub</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Select any official digital voucher product to initiate checkout. Pay securely via verified merchant UPI QR code and receive your activation code upon verification.
          </p>
        </div>

        {/* 4 Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 01 */}
          <div className="rounded-2xl bg-[#0f111e] border border-white/10 p-5 space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
              01
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Select Voucher
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Pick your favorite brand: Amazon, Steam, Netflix, Google Play, Swiggy, and more.
            </p>
          </div>

          {/* Step 02 */}
          <div className="rounded-2xl bg-[#0f111e] border border-white/10 p-5 space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
              02
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Scan & Pay UPI
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Scan the merchant QR code using PhonePe, Google Pay, Paytm, or any BHIM UPI app.
            </p>
          </div>

          {/* Step 03 */}
          <div className="rounded-2xl bg-[#0f111e] border border-white/10 p-5 space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs text-amber-300">
              03
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Pending Verification
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Submit your 12-digit UTR reference. The order status remains Pending while Admin verifies payment.
            </p>
          </div>

          {/* Step 04 */}
          <div className="rounded-2xl bg-[#0f111e] border border-white/10 p-5 space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-xs text-emerald-300">
              04
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Voucher Delivered
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Once verified, your official code and PIN unlock in your orders vault instantly for 100% genuine redemption.
            </p>
          </div>
        </div>

        {/* Support Callout Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/50 to-indigo-950/60 border border-indigo-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official 100% Genuine Voucher Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Need Help With Your Digital Voucher?
            </h3>
            <p className="text-xs text-gray-400 max-w-lg">
              Our 24/7 verification desk and Telegram support helpdesk is available for any redemption or order queries.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSupport}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </button>
            <button
              onClick={onExploreClick}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-1.5"
            >
              <span>Explore Vouchers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
