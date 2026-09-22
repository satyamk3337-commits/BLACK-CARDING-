import React, { useState } from 'react';
import { X, Send, Headphones, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface SupportModalProps {
  settings: StoreSettings;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ settings, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatLogs, setChatLogs] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: `Hello! Welcome to ${settings.storeName || 'VoucherHub'} Support. How can we assist you with your digital voucher order, payment verification, or redemption today?`,
      time: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatLogs((prev) => [...prev, { sender: 'user', text: userMsg, time }]);
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'Thank you for reaching out! Our verification desk has noted your query. Once you submit your 12-digit payment UTR, our merchant gateway verifies it and your voucher code is released promptly.';
      if (userMsg.toLowerCase().includes('utr') || userMsg.toLowerCase().includes('order') || userMsg.toLowerCase().includes('pending')) {
        reply = 'If your order is currently Pending, our Admin verifies payment receipts against bank statements. As soon as confirmed, your official voucher code and PIN will unlock in "My Orders".';
      } else if (userMsg.toLowerCase().includes('redeem') || userMsg.toLowerCase().includes('code')) {
        reply = 'All vouchers are official 100% genuine digital gift codes redeemable directly on the official brand app/website. Instructions and PIN are provided in your order pass.';
      }
      setChatLogs((prev) => [...prev, { sender: 'agent', text: reply, time: 'Just now' }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f111e] border border-indigo-500/40 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#121424]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                24/7 CUSTOMER SUPPORT & HELPDESK
              </h3>
              <p className="text-[11px] text-indigo-400 font-mono">
                Telegram: @{settings.telegramUsername || 'VoucherHubSupport'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telegram & WhatsApp Direct Channels Banner */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-blue-950/80 border-b border-indigo-500/20 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Telegram: <b className="text-white">@{settings.telegramUsername || 'lottaygent'}</b></span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://t.me/${(settings.telegramUsername || 'lottaygent').replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-blue-300 hover:text-white flex items-center gap-1 bg-blue-600/30 hover:bg-blue-600/50 px-2.5 py-1 rounded-md border border-blue-500/40 transition-colors"
              >
                <span>Telegram Chat</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {settings.supportWhatsapp && (
                <a
                  href={`https://wa.me/${settings.supportWhatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-emerald-300 hover:text-white flex items-center gap-1 bg-emerald-600/30 hover:bg-emerald-600/50 px-2.5 py-1 rounded-md border border-emerald-500/40 transition-colors"
                >
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
            <span>⏱ {settings.supportTiming || '24/7 Live Support • 10 Mins SLA'}</span>
            <span>✉ {settings.supportEmail || 'support@darkcarding.io'}</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0c16] text-xs">
          {chatLogs.map((chat, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${chat.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl ${
                  chat.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-[#15182a] border border-white/10 text-gray-200 rounded-tl-none shadow'
                }`}
              >
                <p className="leading-relaxed">{chat.text}</p>
                <span
                  className={`text-[9px] mt-1 block ${
                    chat.sender === 'user' ? 'text-indigo-200 text-right' : 'text-gray-500'
                  }`}
                >
                  {chat.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1 text-[11px] text-gray-500 italic">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">Support Assistant is typing...</span>
            </div>
          )}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#121424] border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question about vouchers or payment..."
            className="flex-1 text-xs bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase flex items-center gap-1 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
