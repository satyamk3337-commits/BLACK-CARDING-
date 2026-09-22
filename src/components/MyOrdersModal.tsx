import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2, Clock, Copy, Check, Download, Headphones, Gift, ShieldCheck, Tag } from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { api } from '../services/api';

interface MyOrdersModalProps {
  orders: Order[];
  settings: StoreSettings;
  onClose: () => void;
  onRefreshOrders: () => void;
  onOpenSupport: () => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  orders,
  settings,
  onClose,
  onRefreshOrders,
  onOpenSupport,
}) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'paid') return o.status === 'paid';
    if (filter === 'pending') return o.status === 'pending_payment';
    return true;
  });

  const copyVoucherCode = (order: Order, specificText?: string) => {
    if (!order.deliveredVoucher) return;
    const v = order.deliveredVoucher;
    const slipText = v.formattedCardSlip || `╭━━━━━━━━━━━━━━━━━━━━╮\n      💳 CARD DETAILS\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n➤ ACCOUNT NO.\n   ${v.accountNo || v.voucherCode || '5172/5258/4406/1926'} ✅\n\n➤ CCV\n   ${v.ccv || v.voucherPin || '102'} ✅\n\n➤ MM/YY\n   ${v.expiry || v.expiryDate || '08/31'} ✅\n\n  Card Holder name — ${v.cardHolderName || order.userName || 'AYUSH'}\n\n  Country ${v.country || 'India delhi'}\n╭━━━━━━━━━━━━━━━━━━━━╮\n        VERIFIED ✅\n╰━━━━━━━━━━━━━━━━━━━━╯`;
    const textToCopy = specificText || slipText;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(specificText ? `${order.id}-${specificText}` : order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadVoucherPass = (order: Order) => {
    if (!order.deliveredVoucher) return;
    const v = order.deliveredVoucher;
    const slipText = v.formattedCardSlip || `╭━━━━━━━━━━━━━━━━━━━━╮\n      💳 CARD DETAILS\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n➤ ACCOUNT NO.\n   ${v.accountNo || v.voucherCode || '5172/5258/4406/1926'} ✅\n\n➤ CCV\n   ${v.ccv || v.voucherPin || '102'} ✅\n\n➤ MM/YY\n   ${v.expiry || v.expiryDate || '08/31'} ✅\n\n  Card Holder name — ${v.cardHolderName || order.userName || 'AYUSH'}\n\n  Country ${v.country || 'India delhi'}\n╭━━━━━━━━━━━━━━━━━━━━╮\n        VERIFIED ✅\n╰━━━━━━━━━━━━━━━━━━━━╯`;

    const text = `=====================================================
DARK CARDING - OFFICIAL CARD DELIVERY RECEIPT
=====================================================
Order Number: ${order.orderNumber}
Issued Date : ${new Date(order.createdAt).toLocaleString()}
Product     : ${order.voucherName}
Status      : VERIFIED & DELIVERED

${slipText}

CUSTOMER SUPPORT:
Telegram: @${settings.telegramUsername || 'lottaygent'}
Email   : ${settings.supportEmail || 'support@darkcarding.io'}
Phone   : ${settings.supportPhone || '+91 80000 12345'}
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.orderNumber}-card-details.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="my-orders-modal"
        className="relative w-full max-w-3xl bg-[#0f111e] border border-indigo-500/30 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden my-4 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#141628] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide">
                MY VOUCHER ORDERS & VAULT
              </h3>
              <p className="text-[11px] text-gray-400">
                Track Pending Payments & Access Delivered Voucher Codes
              </p>
            </div>
          </div>

          <button
            id="close-my-orders-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#101222] shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                filter === 'paid'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Paid / Delivered ({orders.filter((o) => o.status === 'paid').length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                filter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Pending ({orders.filter((o) => o.status === 'pending_payment').length})
            </button>
          </div>

          <button
            onClick={onRefreshOrders}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-500 space-y-3">
              <Gift className="w-12 h-12 mx-auto text-gray-600 stroke-[1.5]" />
              <p className="text-sm font-medium">No orders found in this view.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                BROWSE VOUCHERS CATALOG
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isPending = order.status === 'pending_payment';
              const isPaid = order.status === 'paid';
              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all space-y-3 ${
                    isPending
                      ? 'bg-amber-950/15 border-amber-500/30'
                      : isPaid
                      ? 'bg-[#121426] border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                      : 'bg-red-950/15 border-red-500/30'
                  }`}
                >
                  {/* Top order bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              : isPaid
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {isPending
                            ? 'Pending Payment Verification'
                            : isPaid
                            ? 'Paid • Voucher Delivered'
                            : order.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Purchased on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-white font-mono">
                        ₹{order.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Face Value: ₹{order.faceValue.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Pending state details */}
                  {isPending && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs text-amber-200">
                      <div className="flex items-center gap-2 font-bold text-amber-300">
                        <Clock className="w-4 h-4" />
                        <span>Awaiting Merchant Verification</span>
                      </div>
                      <p className="text-[11px] text-gray-300">
                        Your payment reference (<span className="font-mono text-amber-300">{order.paymentDetails.utrNumber || 'Submitted'}</span>) is being checked by Admin. Once confirmed, your voucher code and PIN will unlock here instantly.
                      </p>
                    </div>
                  )}

                  {/* Delivered Card Details Box if Paid */}
                  {isPaid && order.deliveredVoucher && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#090b14] border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] space-y-4">
                      {/* Top Header */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="text-xs font-black text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>CARD DETAILS RELEASED & VERIFIED</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyVoucherCode(order)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            {copiedId === order.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === order.id ? 'COPIED SLIP' : 'COPY ALL DETAILS'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Exact Boxed Slip as requested */}
                      <div className="relative rounded-xl bg-black/70 border border-emerald-500/30 p-4 font-mono text-emerald-300 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed select-all overflow-x-auto shadow-inner">
                        {order.deliveredVoucher.formattedCardSlip || `╭━━━━━━━━━━━━━━━━━━━━╮\n      💳 CARD DETAILS\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n➤ ACCOUNT NO.\n   ${order.deliveredVoucher.accountNo || order.deliveredVoucher.voucherCode || '5172/5258/4406/1926'} ✅\n\n➤ CCV\n   ${order.deliveredVoucher.ccv || order.deliveredVoucher.voucherPin || '102'} ✅\n\n➤ MM/YY\n   ${order.deliveredVoucher.expiry || order.deliveredVoucher.expiryDate || '08/31'} ✅\n\n  Card Holder name — ${order.deliveredVoucher.cardHolderName || order.userName || 'AYUSH'}\n\n  Country ${order.deliveredVoucher.country || 'India delhi'}\n╭━━━━━━━━━━━━━━━━━━━━╮\n        VERIFIED ✅\n╰━━━━━━━━━━━━━━━━━━━━╯`}
                      </div>

                      {/* Quick Copy Action Chips */}
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <button
                          onClick={() => copyVoucherCode(order, order.deliveredVoucher?.accountNo || order.deliveredVoucher?.voucherCode || '5172/5258/4406/1926')}
                          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3 h-3 text-emerald-400" />
                          <span>Copy Account No</span>
                        </button>
                        <button
                          onClick={() => copyVoucherCode(order, order.deliveredVoucher?.ccv || order.deliveredVoucher?.voucherPin || '102')}
                          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3 h-3 text-emerald-400" />
                          <span>Copy CCV</span>
                        </button>
                        <button
                          onClick={() => copyVoucherCode(order, order.deliveredVoucher?.expiry || order.deliveredVoucher?.expiryDate || '08/31')}
                          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3 h-3 text-emerald-400" />
                          <span>Copy Expiry</span>
                        </button>

                        <div className="ml-auto">
                          <button
                            onClick={() => downloadVoucherPass(order)}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Receipt (.txt)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
