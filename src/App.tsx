import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { VirtualCardItem } from './components/VirtualCardItem';
import { PaymentModal } from './components/PaymentModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { SupportModal } from './components/SupportModal';
import { BottomFeatures } from './components/BottomFeatures';
import { Footer } from './components/Footer';
import { VoucherProduct, Order, User, StoreSettings, DashboardStats } from './types';
import { api } from './services/api';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'VOUCHERHUB',
  subTitle: 'Digital Voucher & Gift Card Marketplace',
  merchantUpiId: 'voucherhub.merchant@upi',
  merchantName: 'VoucherHub Digital Merchant',
  telegramUsername: 'VoucherHubSupport',
  supportEmail: 'support@voucherhub.io',
  supportPhone: '+91 98765 43210',
  customQrUrl: '',
  paymentGatewayName: 'Licensed UPI & Digital Merchant Gateway',
  announcementBanner: '⚡ Automated Digital Delivery • Genuine Brands • Pending Verification Status Active',
  announcementEnabled: true,
  defaultSlaMins: 10,
  adminPassword: 'RAJAJI',
};

const DEFAULT_USER: User = {
  id: 'usr-1',
  name: 'Raja',
  email: 'rajaji5272ji@gmail.com',
  phone: '+91 98765 43210',
  walletBalance: 1500,
  role: 'user',
  totalOrders: 1,
  totalSpent: 850,
  status: 'active',
  createdAt: new Date().toISOString(),
};

export default function App() {
  const [vouchers, setVouchers] = useState<VoucherProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([DEFAULT_USER]);
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 2450,
    totalOrders: 2,
    activeVouchers: 8,
    totalUsers: 2,
    pendingOrders: 1,
    stockCount: 340,
  });

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals
  const [selectedVoucherForPayment, setSelectedVoucherForPayment] = useState<VoucherProduct | null>(null);
  const [editingVoucherForAdmin, setEditingVoucherForAdmin] = useState<VoucherProduct | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch all initial data from server
  const loadData = async () => {
    try {
      const [vouchersRes, ordersRes, usersRes, settingsRes, statsRes] = await Promise.all([
        api.getVouchers(),
        api.getOrders(),
        api.getUsers(),
        api.getSettings(),
        api.getStats(),
      ]);

      if (vouchersRes.success && vouchersRes.vouchers) {
        setVouchers(vouchersRes.vouchers);
      }
      if (ordersRes.success && ordersRes.orders) {
        setOrders(ordersRes.orders);
      }
      if (usersRes.success && usersRes.users) {
        setUsers(usersRes.users);
        const raja = usersRes.users.find(
          (u) => u.name.toLowerCase() === 'raja' || u.email.includes('rajaji')
        );
        if (raja) setCurrentUser(raja);
      }
      if (settingsRes.success && settingsRes.settings) {
        setSettings(settingsRes.settings);
      }
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Error fetching initial platform data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
    loadData();
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter vouchers by category
  const filteredVouchers = vouchers.filter((v) => {
    if (selectedCategory === 'all') return true;
    return v.category === selectedCategory;
  });

  // Calculate category counts
  const categoryCounts = {
    all: vouchers.length,
    shopping: vouchers.filter((v) => v.category === 'shopping').length,
    gaming: vouchers.filter((v) => v.category === 'gaming').length,
    streaming: vouchers.filter((v) => v.category === 'streaming').length,
    food: vouchers.filter((v) => v.category === 'food').length,
    tech: vouchers.filter((v) => v.category === 'tech').length,
  };

  return (
    <div className="min-h-screen bg-[#090a14] text-gray-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header - No "Account" text, sleek dark mobile-first header */}
      <Header
        ordersCount={orders.length}
        settings={settings}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToCatalog={scrollToCatalog}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection settings={settings} onExploreClick={scrollToCatalog} />

        {/* Catalog Section */}
        <section id="catalog-section" className="py-6 scroll-mt-20">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={categoryCounts}
            totalShown={filteredVouchers.length}
          />

          {/* Vouchers Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-400 font-mono tracking-wider">
                  LOADING DIGITAL VOUCHERS CATALOG...
                </span>
              </div>
            ) : filteredVouchers.length === 0 ? (
              <div className="text-center py-16 bg-[#111322] border border-white/5 rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-sm font-bold text-gray-300">
                  No vouchers currently found for this category.
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                >
                  View All Vouchers
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
                {filteredVouchers.map((voucher) => (
                  <VirtualCardItem
                    key={voucher.id}
                    voucher={voucher}
                    onBuy={(v) => setSelectedVoucherForPayment(v)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom Process Steps and Guarantees */}
        <BottomFeatures
          settings={settings}
          onExploreClick={scrollToCatalog}
          onOpenSupport={() => setIsSupportOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals */}
      {selectedVoucherForPayment && (
        <PaymentModal
          voucher={selectedVoucherForPayment}
          settings={settings}
          onClose={() => setSelectedVoucherForPayment(null)}
          onOrderSuccess={handleOrderSuccess}
          onOpenOrders={() => setIsOrdersOpen(true)}
        />
      )}

      {isOrdersOpen && (
        <MyOrdersModal
          orders={orders}
          settings={settings}
          onClose={() => setIsOrdersOpen(false)}
          onRefreshOrders={loadData}
          onOpenSupport={() => {
            setIsOrdersOpen(false);
            setIsSupportOpen(true);
          }}
        />
      )}

      {isAdminOpen && (
        <AdminPanelModal
          vouchers={vouchers}
          orders={orders}
          users={users}
          settings={settings}
          stats={stats}
          onClose={() => {
            setIsAdminOpen(false);
            setEditingVoucherForAdmin(null);
          }}
          onRefreshAll={loadData}
          initialEditVoucher={editingVoucherForAdmin}
        />
      )}

      {isSupportOpen && (
        <SupportModal
          settings={settings}
          onClose={() => setIsSupportOpen(false)}
        />
      )}

      {/* Floating Telegram Support Widget matching screenshot */}
      <a
        href={`https://t.me/${settings.telegramUsername || 'lottaygent'}`}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-telegram-support-btn"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#090b14]/95 hover:bg-[#111424] border border-blue-500/40 text-white shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-all hover:scale-105 group"
      >
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-inner">
          ✈
        </div>
        <div className="text-left">
          <div className="text-[10px] text-gray-400 font-semibold leading-tight">Telegram Support</div>
          <div className="text-xs font-bold text-blue-400 group-hover:text-blue-300">
            @{settings.telegramUsername || 'lottaygent'}
          </div>
        </div>
      </a>
    </div>
  );
}
