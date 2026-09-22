import React from 'react';
import { ShoppingBag, Gamepad2, Tv, Utensils, Sparkles, Layers } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  counts: {
    all: number;
    shopping: number;
    gaming: number;
    streaming: number;
    food: number;
    tech: number;
  };
  totalShown: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
  totalShown,
}) => {
  const categories = [
    { id: 'all', label: 'ALL VOUCHERS', count: counts.all, icon: Layers },
    { id: 'shopping', label: 'SHOPPING', count: counts.shopping, icon: ShoppingBag },
    { id: 'gaming', label: 'GAMING', count: counts.gaming, icon: Gamepad2 },
    { id: 'streaming', label: 'STREAMING', count: counts.streaming, icon: Tv },
    { id: 'food', label: 'FOOD & DINING', count: counts.food, icon: Utensils },
    { id: 'tech', label: 'TECH & APPS', count: counts.tech, icon: Sparkles },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-3">
      {/* Category Pills Slider */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#121324] border border-white/10 shadow-inner">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                id={`filter-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                {cat.count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black/30 text-white' : 'text-gray-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-header status bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 text-xs text-gray-400 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wider text-gray-300 uppercase text-[11px]">
            SHOWING {totalShown} VERIFIED DIGITAL VOUCHER OFFERS
          </span>
        </div>

        <div className="text-[11px] text-gray-400 font-medium tracking-wide">
          Direct Payment Confirmation • Code Release Upon Verification
        </div>
      </div>
    </div>
  );
};
