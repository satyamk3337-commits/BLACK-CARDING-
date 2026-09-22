import React from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { VoucherProduct } from '../types';

interface VirtualCardItemProps {
  voucher: VoucherProduct;
  onBuy: (voucher: VoucherProduct) => void;
  onEdit?: (voucher: VoucherProduct) => void;
  isAdmin?: boolean;
}

// Realistic EMV Gold Microchip Component
const EmvGoldChip: React.FC = () => (
  <div className="w-10 h-7 sm:w-11 sm:h-8 rounded-[4px] bg-gradient-to-br from-[#ffe082] via-[#ffb300] to-[#b27b00] p-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.5)] relative overflow-hidden shrink-0">
    <div className="w-full h-full border border-amber-950/40 rounded-[3px] grid grid-cols-2 relative bg-amber-400/20">
      <div className="border-r border-b border-amber-950/30" />
      <div className="border-b border-amber-950/30" />
      <div className="border-r border-amber-950/30" />
      <div />
      <div className="absolute inset-x-1.5 inset-y-1 border border-amber-950/30 rounded-sm" />
    </div>
  </div>
);

// Centurion Watermark for American Express Cards
const CenturionHelmetWatermark: React.FC<{ isSilver?: boolean }> = ({ isSilver }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
    <svg
      viewBox="0 0 160 160"
      className={`w-36 h-36 sm:w-44 sm:h-44 ${isSilver ? 'opacity-25 text-gray-800' : 'opacity-15 text-white'}`}
      fill="currentColor"
    >
      {/* Outer Decorative Crest Circle */}
      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.6" />
      <circle cx="80" cy="80" r="64" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Roman Centurion Profile & Helmet */}
      <path
        d="M80 30 C66 30 55 40 52 54 C44 59 38 69 38 82 C38 96 46 110 59 118 C65 132 75 142 86 145 C93 147 101 145 106 140 C117 130 122 114 120 98 C127 88 127 74 120 64 C115 43 98 30 80 30 Z"
        opacity="0.3"
      />
      <path
        d="M60 48 C68 39 86 37 98 46 C108 53 111 65 110 77 C102 80 89 82 76 82 C65 82 54 78 50 71 C50 60 55 51 60 48 Z"
        opacity="0.5"
      />
      {/* Plume Crest */}
      <path
        d="M48 34 C56 22 76 17 92 20 C108 23 119 35 124 50 C118 45 108 42 95 42 C79 42 63 45 48 34 Z"
        opacity="0.7"
      />
      {/* Visor & Nose guard */}
      <path d="M76 84 L92 84 L87 106 L79 111 L73 103 Z" opacity="0.6" />
    </svg>
  </div>
);

export const VirtualCardItem: React.FC<VirtualCardItemProps> = ({
  voucher,
  onBuy,
  onEdit,
  isAdmin,
}) => {
  const isOutOfStock = voucher.stockStatus === 'out_of_stock' || voucher.stock <= 0;

  // Derive card type & styling matching screenshot
  const network = voucher.cardNetwork || (
    voucher.brand.toLowerCase().includes('amex') || voucher.name.toLowerCase().includes('amex') || voucher.name.toLowerCase().includes('american express')
      ? 'AMEX'
      : voucher.brand.toLowerCase().includes('mastercard') || voucher.name.toLowerCase().includes('mastercard')
      ? 'MASTERCARD'
      : 'VISA'
  );

  const isAmex = network === 'AMEX';
  const isMastercard = network === 'MASTERCARD';
  const isVisa = network === 'VISA';

  // Determine card aesthetic variation
  const isSilverAmex = isAmex && (voucher.voucherTheme === 'amber-gold' || voucher.name.toLowerCase().includes('platinum') || voucher.sellingPrice === 3250);
  const isBusinessAmex = isAmex && !isSilverAmex && (voucher.name.toLowerCase().includes('business') || voucher.sellingPrice === 3700);
  const isTealAmex = isAmex && !isSilverAmex && !isBusinessAmex;

  // Masked Number fallback
  const cardNumber = voucher.cardNumberMasked || (
    isAmex
      ? '•••• •••••• •6545'
      : isMastercard
      ? '•••• •••• •••• 2878'
      : '•••• •••• •••• 8565'
  );

  // Cardholder name
  const cardHolder = voucher.cardHolder || (
    isSilverAmex
      ? 'MATTHEW S. PRESCOTT'
      : isBusinessAmex
      ? 'VICTORIA L. WINCHESTER'
      : isTealAmex
      ? 'JAMESON L. CHASE'
      : isMastercard
      ? 'GAURAV S. MALHOTRA'
      : voucher.sellingPrice === 1900
      ? 'NEELAM K. PATEL'
      : 'DEVENDRA CHOUDHARY'
  );

  // Expiry date
  const validity = voucher.validity || '08/2031';

  // Card Limit / Balance display
  const cardLimitFormatted = voucher.cardLimitFormatted || `₹ ${voucher.faceValue.toLocaleString('en-IN')} Balance`;

  // Refund policy
  const refundPolicy = voucher.refundPolicy || '100% Refundable';

  // SLA Instant Release
  const instantRelease = voucher.instantRelease || '10 Mins SLA';

  // In Pool count
  const inPoolCount = voucher.inPool ?? (voucher.stock > 0 ? voucher.stock : 6);

  // Card background styling
  const getCardSurfaceStyle = () => {
    if (isSilverAmex) {
      return 'bg-gradient-to-br from-[#d4d7dc] via-[#a6acb4] to-[#606771] text-gray-900 border-white/40 shadow-[0_12px_30px_rgba(0,0,0,0.5)]';
    }
    if (isBusinessAmex) {
      return 'bg-gradient-to-br from-[#1e2e4a] via-[#101b30] to-[#060a14] text-white border-blue-500/20 shadow-[0_12px_30px_rgba(16,27,48,0.6)]';
    }
    if (isTealAmex) {
      return 'bg-gradient-to-br from-[#12424d] via-[#0b2931] to-[#041217] text-white border-teal-500/20 shadow-[0_12px_30px_rgba(18,66,77,0.6)]';
    }
    if (isMastercard) {
      return 'bg-gradient-to-br from-[#7a2e12] via-[#451608] to-[#1c0803] text-white border-amber-500/20 shadow-[0_12px_30px_rgba(122,46,18,0.5)]';
    }
    // Default Visa
    if (voucher.sellingPrice === 1900) {
      return 'bg-gradient-to-br from-[#1b2b52] via-[#111c38] to-[#080d1b] text-white border-blue-400/20 shadow-[0_12px_30px_rgba(27,43,82,0.6)]';
    }
    return 'bg-gradient-to-br from-[#101b33] via-[#0a1122] to-[#040710] text-white border-indigo-400/20 shadow-[0_12px_30px_rgba(16,27,51,0.6)]';
  };

  return (
    <div
      id={`card-item-${voucher.id}`}
      className="group relative flex flex-col rounded-2xl bg-[#090b14] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 p-4 sm:p-5 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
    >
      {/* Top Status & Badges Bar */}
      <div className="flex items-center justify-between gap-1.5 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* IN STOCK Pill Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>IN STOCK</span>
          </span>

          {/* Secondary Badges (e.g. TRUSTED CARD, UNLIMITED ACCESS, FEATURED) */}
          {voucher.badges && voucher.badges.length > 0 ? (
            voucher.badges.map((badge, idx) => {
              const isFeatured = badge.includes('FEATURED');
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                    isFeatured
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 flex items-center gap-1'
                      : 'bg-purple-950/40 text-purple-300 border-purple-500/30'
                  }`}
                >
                  {isFeatured && <span>★</span>}
                  <span>{badge}</span>
                </span>
              );
            })
          ) : (
            isAmex && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-purple-950/40 text-purple-300 border border-purple-500/30">
                TRUSTED CARD
              </span>
            )
          )}
        </div>

        {/* Right Status Dot */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
      </div>

      {/* Realistic Credit Card Surface Box */}
      <div
        className={`relative w-full aspect-[1.586/1] rounded-xl border p-4 sm:p-5 flex flex-col justify-between overflow-hidden select-none transition-transform duration-300 group-hover:scale-[1.01] ${getCardSurfaceStyle()}`}
      >
        {/* Subtle Sheen / Texture */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />

        {/* Amex Centurion Watermark in Center */}
        {isAmex && <CenturionHelmetWatermark isSilver={isSilverAmex} />}

        {/* TOP ROW: EMV Chip on Left, Network Brand on Right */}
        <div className="relative z-10 flex items-start justify-between">
          {/* Gold EMV Chip */}
          <EmvGoldChip />

          {/* Network Brand Typography */}
          <div className="text-right">
            {isAmex && (
              <div>
                <span
                  className={`block font-black text-xs sm:text-sm tracking-wider uppercase ${
                    isSilverAmex ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  {isBusinessAmex ? 'AMERICAN EXPRESS' : 'AMERICAN EXPRESS'}
                </span>
                {isBusinessAmex && (
                  <span className="block text-[8px] sm:text-[9px] tracking-widest uppercase font-bold text-blue-200/90 -mt-0.5">
                    BUSINESS PLUS
                  </span>
                )}
                <span
                  className={`inline-block text-[9px] sm:text-[10px] font-black tracking-widest uppercase italic mt-0.5 ${
                    isSilverAmex ? 'text-gray-800' : 'text-white/80'
                  }`}
                >
                  AMEX
                </span>
              </div>
            )}

            {isVisa && (
              <div className="italic font-black text-xl sm:text-2xl tracking-tight text-white pr-1">
                VISA
              </div>
            )}

            {isMastercard && (
              <div className="flex items-center gap-1.5 justify-end">
                <span className="italic font-black text-xs sm:text-sm tracking-wider text-white">
                  MASTERCARD
                </span>
                <div className="flex -space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 opacity-90" />
                  <div className="w-4 h-4 rounded-full bg-amber-400 opacity-90" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE ROW: Masked Number & Contactless symbol */}
        <div className="relative z-10 my-auto pt-2">
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-sm sm:text-base font-bold tracking-[0.22em] ${
                isSilverAmex ? 'text-gray-900' : 'text-white'
              }`}
            >
              {cardNumber}
            </span>

            {/* Contactless waves & security code (Amex) */}
            {isAmex && (
              <span
                className={`text-[10px] sm:text-xs font-mono font-bold tracking-wider ${
                  isSilverAmex ? 'text-gray-700' : 'text-white/70'
                }`}
              >
                {voucher.cardSecurityCode || '))) 7997'}
              </span>
            )}
          </div>
        </div>

        {/* BOTTOM ROW: Cardholder, Expiry, & Hologram */}
        <div className="relative z-10 flex items-end justify-between">
          {/* Card Holder */}
          <div>
            <div
              className={`text-[8px] tracking-wider uppercase font-semibold ${
                isSilverAmex ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              CARD HOLDER
            </div>
            <div
              className={`font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase ${
                isSilverAmex ? 'text-gray-900' : 'text-white'
              }`}
            >
              {cardHolder}
            </div>
          </div>

          {/* Valid Thru & Hologram */}
          <div className="flex items-center gap-3 text-right">
            <div>
              <div
                className={`text-[8px] tracking-wider uppercase font-semibold ${
                  isSilverAmex ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                VALID THRU
              </div>
              <div
                className={`font-mono text-[11px] sm:text-xs font-bold ${
                  isSilverAmex ? 'text-gray-900' : 'text-white'
                }`}
              >
                {validity}
              </div>
            </div>

            {/* Security Hologram Circle */}
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-emerald-400/60 bg-emerald-500/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* CARD DETAILS LIST (Matches user screenshot) */}
      <div className="mt-4 space-y-2.5 text-xs border-b border-white/5 pb-3">
        {/* CARD LIMIT */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">
            CARD LIMIT
          </span>
          <span className="font-extrabold text-white text-xs sm:text-[13px] tracking-tight">
            {cardLimitFormatted}
          </span>
        </div>

        {/* VALIDITY */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">
            VALIDITY
          </span>
          <span className="font-mono text-gray-200 text-xs sm:text-[13px]">
            {validity}
          </span>
        </div>

        {/* REFUND POLICY */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">
            REFUND POLICY
          </span>
          <span className="font-bold text-emerald-400 text-xs sm:text-[13px]">
            {refundPolicy}
          </span>
        </div>

        {/* INSTANT RELEASE */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">
            INSTANT RELEASE
          </span>
          <span className="font-bold text-cyan-300 text-xs sm:text-[13px] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{instantRelease}</span>
          </span>
        </div>
      </div>

      {/* PRICING & POOL AVAILABILITY (Matches user screenshot) */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            ACQUISITION PRICE
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            ₹{voucher.sellingPrice.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="text-right text-xs text-gray-400 font-medium">
          In Pool: <span className="text-gray-200 font-bold">{inPoolCount}</span>
        </div>
      </div>

      {/* BUY NOW BUTTON - SHINING CHAMAK BUTTON (BUY BATTAN CHAMKE) */}
      <div className="mt-3">
        <button
          id={`buy-card-btn-${voucher.id}`}
          onClick={() => onBuy(voucher)}
          disabled={isOutOfStock}
          className={`relative w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-neutral-800 text-gray-500 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white border border-pink-400/50 shadow-[0_0_20px_rgba(168,85,247,0.5)] chamak-btn hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {/* Continuous shining light beam sweep (Chamak ray) */}
          {!isOutOfStock && (
            <>
              <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent chamak-beam pointer-events-none" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 chamak-star shrink-0" />
            </>
          )}

          <span className="relative z-10 font-black tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {isOutOfStock ? 'OUT OF STOCK' : '⚡ BUY NOW'}
          </span>

          {!isOutOfStock && (
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 chamak-star shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
};
