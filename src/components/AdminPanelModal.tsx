import React, { useState } from 'react';
import {
  X,
  Lock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Tag,
  Settings as SettingsIcon,
  ShoppingBag,
  Clock,
  Shield,
  Search,
  Check,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  QrCode,
  Gift,
  ExternalLink,
  Headphones,
  Phone,
  Mail,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { VoucherProduct, Order, User, StoreSettings, DashboardStats, VoucherCategory, VoucherTheme } from '../types';
import { api } from '../services/api';

interface AdminPanelModalProps {
  vouchers: VoucherProduct[];
  orders: Order[];
  users: User[];
  settings: StoreSettings;
  stats: DashboardStats;
  onClose: () => void;
  onRefreshAll: () => void;
  initialEditVoucher?: VoucherProduct | null;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  vouchers,
  orders,
  users,
  settings,
  stats,
  onClose,
  onRefreshAll,
  initialEditVoucher,
}) => {
  // Password protection: Requires RAJAJI
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'vouchers' | 'orders' | 'support' | 'settings' | 'users' | 'stats'>('vouchers');

  // Voucher Add/Edit Modal state
  const [isVoucherFormOpen, setIsVoucherFormOpen] = useState(!!initialEditVoucher);
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(initialEditVoucher?.id || null);
  const [voucherFormData, setVoucherFormData] = useState({
    name: initialEditVoucher?.name || '',
    category: (initialEditVoucher?.category || 'shopping') as VoucherCategory,
    brand: initialEditVoucher?.brand || '',
    faceValue: initialEditVoucher?.faceValue || 1000,
    sellingPrice: initialEditVoucher?.sellingPrice || 850,
    stock: initialEditVoucher?.stock || 50,
    validity: initialEditVoucher?.validity || '365 Days',
    stockStatus: (initialEditVoucher?.stockStatus || 'in_stock') as 'in_stock' | 'out_of_stock',
    badges: initialEditVoucher?.badges.join(', ') || 'FEATURED, 15% OFF',
    redemptionGuide: initialEditVoucher?.redemptionGuide || 'Redeem on the official brand website or mobile app.',
    voucherTheme: (initialEditVoucher?.voucherTheme || 'amber-gold') as VoucherTheme,
    description: initialEditVoucher?.description || '',
  });

  // Settings form state (including Customer Support and Payment QR!)
  const [settingsFormData, setSettingsFormData] = useState({
    storeName: settings.storeName,
    subTitle: settings.subTitle,
    merchantUpiId: settings.merchantUpiId,
    merchantName: settings.merchantName,
    customQrUrl: settings.customQrUrl || '',
    telegramUsername: settings.telegramUsername,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone || '+91 80000 12345',
    supportWhatsapp: settings.supportWhatsapp || '+91 98765 43210',
    supportTiming: settings.supportTiming || '24/7 Live Support • 10 Mins SLA',
    announcementBanner: settings.announcementBanner,
    announcementEnabled: settings.announcementEnabled,
    defaultSlaMins: settings.defaultSlaMins,
    paymentGatewayName: settings.paymentGatewayName || 'Licensed UPI & Digital Merchant Gateway',
  });

  // Custom card details verification dialog
  const [verifyingOrder, setVerifyingOrder] = useState<Order | null>(null);
  const [cardDeliveryForm, setCardDeliveryForm] = useState({
    accountNo: '5172/5258/4406/1926',
    ccv: '102',
    expiry: '08/31',
    cardHolderName: 'AYUSH',
    country: 'India delhi',
  });

  // Users state
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'user' | 'admin',
  });
  const [balanceDeltaMap, setBalanceDeltaMap] = useState<Record<string, string>>({});

  // Search queries
  const [voucherSearch, setVoucherSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Authenticate Admin with password RAJAJI
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const inputPass = adminPasswordInput.trim();
    if (!inputPass) {
      setAuthError('Please enter the Admin Password.');
      return;
    }

    try {
      const res = await api.verifyAdminPassword(inputPass);
      if (res.success && res.authorized) {
        setIsAdminAuthenticated(true);
      } else {
        setAuthError(res.error || 'Incorrect Admin Password. Access Denied.');
      }
    } catch (err: any) {
      // Local fallback check
      if (inputPass.toUpperCase() === 'RAJAJI') {
        setIsAdminAuthenticated(true);
      } else {
        setAuthError('Incorrect Admin Password. Access Denied.');
      }
    }
  };

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Open Edit Form
  const handleOpenEdit = (v: VoucherProduct) => {
    setEditingVoucherId(v.id);
    setVoucherFormData({
      name: v.name,
      category: v.category,
      brand: v.brand,
      faceValue: v.faceValue,
      sellingPrice: v.sellingPrice,
      stock: v.stock,
      validity: v.validity,
      stockStatus: v.stockStatus,
      badges: v.badges.join(', '),
      redemptionGuide: v.redemptionGuide,
      voucherTheme: v.voucherTheme,
      description: v.description || '',
    });
    setIsVoucherFormOpen(true);
  };

  // Open New Form
  const handleOpenNew = () => {
    setEditingVoucherId(null);
    setVoucherFormData({
      name: '',
      category: 'shopping',
      brand: 'Amazon',
      faceValue: 1000,
      sellingPrice: 850,
      stock: 50,
      validity: '365 Days',
      stockStatus: 'in_stock',
      badges: 'HOT DEAL, 15% OFF',
      redemptionGuide: 'Redeem code in official mobile app or website checkout.',
      voucherTheme: 'amber-gold',
      description: 'Official digital voucher code.',
    });
    setIsVoucherFormOpen(true);
  };

  // Save Voucher
  const handleSaveVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const badgesArray = voucherFormData.badges
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean);

      const payload = {
        name: voucherFormData.name.trim(),
        category: voucherFormData.category,
        brand: voucherFormData.brand.trim(),
        faceValue: Number(voucherFormData.faceValue),
        sellingPrice: Number(voucherFormData.sellingPrice),
        stock: Number(voucherFormData.stock),
        validity: voucherFormData.validity.trim(),
        stockStatus: Number(voucherFormData.stock) > 0 ? voucherFormData.stockStatus : 'out_of_stock',
        badges: badgesArray,
        redemptionGuide: voucherFormData.redemptionGuide.trim(),
        voucherTheme: voucherFormData.voucherTheme,
        description: voucherFormData.description.trim(),
      };

      if (editingVoucherId) {
        await api.updateVoucher(editingVoucherId, payload);
        showNotification('Voucher updated successfully!');
      } else {
        await api.addVoucher(payload);
        showNotification('New voucher created successfully!');
      }

      setIsVoucherFormOpen(false);
      onRefreshAll();
    } catch (err: any) {
      alert('Failed to save voucher: ' + err.message);
    }
  };

  // Delete Voucher
  const handleDeleteVoucher = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return;
    try {
      await api.deleteVoucher(id);
      showNotification('Voucher deleted.');
      onRefreshAll();
    } catch (err: any) {
      alert('Delete error: ' + err.message);
    }
  };

  // Verify and Approve Order (As requested: admin verify dega to card details milega!)
  const handleVerifyOrder = async (
    orderId: string,
    customDetails?: { accountNo?: string; ccv?: string; expiry?: string; cardHolderName?: string; country?: string }
  ) => {
    try {
      const res = await api.updateOrderStatus(orderId, 'paid', 'Verified & Released by Admin RAJAJI', customDetails);
      if (res.success) {
        showNotification('Order verified! Verified card details released to customer vault.');
        setVerifyingOrder(null);
        onRefreshAll();
      }
    } catch (err: any) {
      alert('Failed to verify order: ' + err.message);
    }
  };

  const handleOpenCustomVerify = (order: Order) => {
    const voucher = vouchers.find((v) => v.id === order.voucherId);
    const isAmex = voucher?.cardNetwork === 'AMEX' || voucher?.brand?.toLowerCase().includes('amex');
    const defaultAcc = voucher?.cardNumberMasked && !voucher.cardNumberMasked.includes('••')
      ? voucher.cardNumberMasked
      : `${isAmex ? '3772' : '5172'}/5258/4406/1926`;

    setCardDeliveryForm({
      accountNo: defaultAcc,
      ccv: isAmex ? '7997' : '102',
      expiry: voucher?.validity ? voucher.validity.replace(/20/g, '') : '08/31',
      cardHolderName: order.userName || voucher?.cardHolder || 'AYUSH',
      country: 'India delhi',
    });
    setVerifyingOrder(order);
  };

  // Reject Order
  const handleRejectOrder = async (orderId: string) => {
    const reason = prompt('Enter rejection reason (e.g. Invalid UTR / Payment not received):');
    if (!reason) return;
    try {
      await api.updateOrderStatus(orderId, 'rejected', reason);
      showNotification('Order rejected.');
      onRefreshAll();
    } catch (err: any) {
      alert('Failed to reject order: ' + err.message);
    }
  };

  // Save Settings (including Customer Support and QR code change)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pass = adminPasswordInput || 'RAJAJI';
      const res = await api.updateSettings(settingsFormData, pass);
      if (res.success) {
        showNotification('Customer Support & Store Settings updated successfully!');
        onRefreshAll();
      } else {
        alert(res.error || 'Failed to update settings');
      }
    } catch (err: any) {
      alert('Settings error: ' + err.message);
    }
  };

  // Filter vouchers
  const filteredVouchers = vouchers.filter(
    (v) =>
      v.name.toLowerCase().includes(voucherSearch.toLowerCase()) ||
      v.brand.toLowerCase().includes(voucherSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(voucherSearch.toLowerCase())
  );

  // Filter orders
  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.userName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.paymentDetails.utrNumber && o.paymentDetails.utrNumber.includes(orderSearch))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="admin-panel-modal"
        className="relative w-full max-w-5xl bg-[#0d0f1b] border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden my-4 flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#121424] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide">
                  ADMIN CONTROL CENTER
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SECURE PORTAL
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Manage Vouchers, Approve Pending Orders & Update Merchant QR
              </p>
            </div>
          </div>

          <button
            id="close-admin-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOT AUTHENTICATED: Show Admin Password Prompt (RAJAJI) */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight mb-1">
              Admin Access Required
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mb-6">
              Enter the administrative password to manage voucher catalog, verify payments, and change payment QR.
            </p>

            <form onSubmit={handleAdminLogin} className="w-full max-w-xs space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 text-left">
                  ADMIN PASSWORD
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-center font-mono text-base font-bold text-white tracking-widest focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              {authError && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                id="submit-admin-login-btn"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                UNLOCK ADMIN PANEL
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-white/10 bg-[#101222] overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('vouchers')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'vouchers'
                    ? 'border-amber-400 text-amber-300 bg-white/[0.02]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>VOUCHER PRODUCTS ({vouchers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-amber-400 text-amber-300 bg-white/[0.02]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ORDERS ({orders.length})</span>
                {orders.filter((o) => o.status === 'pending_payment').length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
                    {orders.filter((o) => o.status === 'pending_payment').length} PENDING
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('support')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'support'
                    ? 'border-blue-400 text-blue-300 bg-white/[0.02]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>CUSTOMER SUPPORT</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-amber-400 text-amber-300 bg-white/[0.02]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>PAYMENT QR & SETTINGS</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'users'
                    ? 'border-amber-400 text-amber-300 bg-white/[0.02]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>USERS ({users.length})</span>
              </button>
            </div>

            {/* Notification message */}
            {actionMessage && (
              <div className="px-6 py-2 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
                <span>✓ {actionMessage}</span>
                <button onClick={() => setActionMessage(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* TAB 1: VOUCHERS LIST & ADD/EDIT */}
              {activeTab === 'vouchers' && (
                <div className="space-y-4">
                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search vouchers by name or brand..."
                        value={voucherSearch}
                        onChange={(e) => setVoucherSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      onClick={handleOpenNew}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>ADD NEW VOUCHER</span>
                    </button>
                  </div>

                  {/* Vouchers Table */}
                  <div className="rounded-xl border border-white/10 bg-[#121424] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold text-gray-400">
                          <tr>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Face Value</th>
                            <th className="p-3">Selling Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Validity</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredVouchers.map((v) => (
                            <tr key={v.id} className="hover:bg-white/[0.02]">
                              <td className="p-3">
                                <div className="font-bold text-white">{v.name}</div>
                                <div className="text-[10px] text-gray-400">{v.brand}</div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 text-gray-300">
                                  {v.category}
                                </span>
                              </td>
                              <td className="p-3 font-mono font-bold text-gray-300">
                                ₹{v.faceValue}
                              </td>
                              <td className="p-3 font-mono font-bold text-emerald-400">
                                ₹{v.sellingPrice}
                              </td>
                              <td className="p-3 font-mono text-gray-300">
                                {v.stock}
                              </td>
                              <td className="p-3 text-gray-400">
                                {v.validity}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    v.stockStatus === 'in_stock'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  }`}
                                >
                                  {v.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEdit(v)}
                                    className="p-1.5 rounded bg-white/5 hover:bg-amber-500/20 text-gray-400 hover:text-amber-300 transition-colors cursor-pointer"
                                    title="Edit Voucher"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVoucher(v.id)}
                                    className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                    title="Delete Voucher"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT (Pending Approval & Verification) */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search orders by number, UTR, or customer..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="text-xs text-gray-400">
                      Pending Approvals: <span className="text-amber-400 font-bold">{orders.filter((o) => o.status === 'pending_payment').length}</span>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-xs">
                      No matching orders found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredOrders.map((order) => {
                        const isPending = order.status === 'pending_payment';
                        const isPaid = order.status === 'paid';
                        return (
                          <div
                            key={order.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isPending
                                ? 'bg-amber-950/15 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                : isPaid
                                ? 'bg-[#121424] border-white/10'
                                : 'bg-red-950/15 border-red-500/30'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-white text-sm">
                                    {order.orderNumber}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                      isPending
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                        : isPaid
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                    }`}
                                  >
                                    {isPending ? 'Pending Verification' : isPaid ? 'Paid & Delivered' : order.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                  Customer: <span className="text-white font-medium">{order.userName}</span> ({order.userEmail})
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-base font-black text-emerald-400 font-mono">
                                  ₹{order.amount.toLocaleString('en-IN')}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  {new Date(order.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {/* Details & Payment Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-xs">
                              <div>
                                <span className="text-[10px] uppercase text-gray-500 block">Voucher Item</span>
                                <span className="text-white font-medium">{order.voucherName}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase text-gray-500 block">UTR / Txn Reference</span>
                                <span className="font-mono text-amber-300 font-bold select-all">
                                  {order.paymentDetails.utrNumber || 'No UTR provided'}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase text-gray-500 block">Payment Note</span>
                                <span className="text-gray-400">{order.paymentDetails.slipNote || 'None'}</span>
                              </div>
                            </div>

                            {/* If Paid, Show Delivered Card Slip */}
                            {order.deliveredVoucher && (
                              <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Verified Card Slip Delivered to Customer</span>
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">
                                    MM/YY: {order.deliveredVoucher.expiry} | CCV: {order.deliveredVoucher.ccv}
                                  </span>
                                </div>
                                <div className="font-mono text-emerald-300 text-xs bg-black/80 p-3 rounded-lg border border-emerald-500/20 whitespace-pre-wrap select-all">
                                  {order.deliveredVoucher.formattedCardSlip || `╭━━━━━━━━━━━━━━━━━━━━╮\n      💳 CARD DETAILS\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n➤ ACCOUNT NO.\n   ${order.deliveredVoucher.accountNo || order.deliveredVoucher.voucherCode} ✅\n\n➤ CCV\n   ${order.deliveredVoucher.ccv || order.deliveredVoucher.voucherPin} ✅\n\n➤ MM/YY\n   ${order.deliveredVoucher.expiry || order.deliveredVoucher.expiryDate} ✅\n\n  Card Holder name — ${order.deliveredVoucher.cardHolderName || order.userName}\n\n  Country ${order.deliveredVoucher.country || 'India delhi'}\n╭━━━━━━━━━━━━━━━━━━━━╮\n        VERIFIED ✅\n╰━━━━━━━━━━━━━━━━━━━━╯`}
                                </div>
                              </div>
                            )}

                            {/* Admin Action Buttons for Pending Orders */}
                            {isPending && (
                              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5 flex-wrap">
                                <button
                                  onClick={() => handleRejectOrder(order.id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                                >
                                  Reject Order
                                </button>
                                <button
                                  onClick={() => handleOpenCustomVerify(order)}
                                  className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <Sliders className="w-3.5 h-3.5" />
                                  <span>Custom Card Details</span>
                                </button>
                                <button
                                  onClick={() => handleVerifyOrder(order.id)}
                                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Verify & Deliver Card</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CUSTOMER SUPPORT SETTINGS (Customer support change karne ka option admin panel me) */}
              {activeTab === 'support' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                      <Headphones className="w-4 h-4 text-blue-400" />
                      <span>CUSTOMER SUPPORT SETTINGS (ग्राहक सहायता सेटिंग्स)</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Change your official Telegram support username, WhatsApp support number, telephone helpline, email, and live support hours. All changes reflect live instantly across the website header, support dialog, floating chat button, and delivered card slips.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Telegram Support Username */}
                    <div className="p-4 rounded-xl bg-[#121424] border border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-white uppercase tracking-wider">
                        TELEGRAM SUPPORT USERNAME <span className="text-blue-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">@</span>
                        <input
                          type="text"
                          value={settingsFormData.telegramUsername.replace(/^@/, '')}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, telegramUsername: e.target.value.replace(/^@/, '') })}
                          placeholder="lottaygent"
                          className="w-full pl-7 pr-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Links directly to: <span className="text-blue-300 font-mono">https://t.me/{settingsFormData.telegramUsername || 'lottaygent'}</span>
                      </p>
                      <div className="pt-1">
                        <a
                          href={`https://t.me/${(settingsFormData.telegramUsername || 'lottaygent').replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold transition-all"
                        >
                          <span>Test Telegram Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* WhatsApp Support Number */}
                    <div className="p-4 rounded-xl bg-[#121424] border border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-white uppercase tracking-wider">
                        WHATSAPP SUPPORT NUMBER <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={settingsFormData.supportWhatsapp}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, supportWhatsapp: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-emerald-400"
                      />
                      <p className="text-[10px] text-gray-400">
                        Include country code (e.g. +91) for direct WhatsApp messaging.
                      </p>
                      {settingsFormData.supportWhatsapp && (
                        <div className="pt-1">
                          <a
                            href={`https://wa.me/${settingsFormData.supportWhatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all"
                          >
                            <span>Test WhatsApp Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Customer Support Phone / Helpline */}
                    <div className="p-4 rounded-xl bg-[#121424] border border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-white uppercase tracking-wider">
                        CUSTOMER HELPLINE / PHONE
                      </label>
                      <input
                        type="text"
                        value={settingsFormData.supportPhone}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, supportPhone: e.target.value })}
                        placeholder="+91 80000 12345"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-indigo-400"
                      />
                      <p className="text-[10px] text-gray-400">Direct phone line printed on invoices and slips.</p>
                    </div>

                    {/* Official Support Email */}
                    <div className="p-4 rounded-xl bg-[#121424] border border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-white uppercase tracking-wider">
                        OFFICIAL SUPPORT EMAIL
                      </label>
                      <input
                        type="email"
                        value={settingsFormData.supportEmail}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, supportEmail: e.target.value })}
                        placeholder="support@darkcarding.io"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-indigo-400"
                      />
                      <p className="text-[10px] text-gray-400">Official mailbox for payment slips and dispute tickets.</p>
                    </div>
                  </div>

                  {/* Support Hours / Response Timing */}
                  <div className="p-4 rounded-xl bg-[#121424] border border-white/10 space-y-2">
                    <label className="block text-[11px] font-bold text-white uppercase tracking-wider">
                      SUPPORT WORKING HOURS & SLA
                    </label>
                    <input
                      type="text"
                      value={settingsFormData.supportTiming}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, supportTiming: e.target.value })}
                      placeholder="24/7 Live Support • 10 Mins SLA"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400"
                    />
                    <p className="text-[10px] text-gray-400">Displayed in customer support dialog and delivery slip.</p>
                  </div>

                  {/* Announcement Banner */}
                  <div className="p-4 rounded-xl bg-[#121424] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-white uppercase tracking-wider">
                        HEADER ANNOUNCEMENT & NOTICE BAR
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsFormData.announcementEnabled}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, announcementEnabled: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-500 focus:ring-0"
                        />
                        <span className="text-xs text-gray-300">Show Announcement on Header</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={settingsFormData.announcementBanner}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, announcementBanner: e.target.value })}
                      placeholder="⚡ Automated Digital Delivery • Genuine Brands • Pending Verification Status Active"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Live Preview Card */}
                  <div className="p-4 rounded-xl bg-black/60 border border-blue-500/20 space-y-3">
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      CUSTOMER VIEW PREVIEW (ग्राहक को ऐसा दिखेगा)
                    </div>
                    <div className="p-3 rounded-lg bg-[#0e101d] border border-white/10 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-sm">
                          🎧
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>Telegram: @{settingsFormData.telegramUsername || 'lottaygent'}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            WhatsApp: {settingsFormData.supportWhatsapp || '+91 98765 43210'} • {settingsFormData.supportTiming}
                          </div>
                        </div>
                      </div>

                      <div className="px-3 py-1.5 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold">
                        Open Support Chat ↗
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>SAVE CUSTOMER SUPPORT SETTINGS (ग्राहक सहायता सेव करें)</span>
                  </button>
                </form>
              )}

              {/* TAB 3: PAYMENT QR & STORE SETTINGS (Admin panel me qr change karne ka option!) */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                  {/* Dedicated QR Code Config Section */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <QrCode className="w-4 h-4" />
                      <span>CUSTOM PAYMENT QR CODE & MERCHANT UPI</span>
                    </div>
                    <p className="text-xs text-gray-300">
                      Configure your official merchant QR code and UPI ID shown to customers at checkout. You can paste a direct image URL or use the dynamic UPI generator.
                    </p>

                    <div>
                      <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                        MERCHANT UPI ID (VPA) <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsFormData.merchantUpiId}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, merchantUpiId: e.target.value })}
                        placeholder="e.g. yourname@okaxis or merchant@upi"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                        MERCHANT DISPLAY NAME <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsFormData.merchantName}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, merchantName: e.target.value })}
                        placeholder="e.g. Official Voucher Merchant"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                        CUSTOM QR IMAGE URL (OPTIONAL)
                      </label>
                      <input
                        type="url"
                        value={settingsFormData.customQrUrl}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, customQrUrl: e.target.value })}
                        placeholder="https://example.com/my-merchant-qr.png (leave blank for auto-generated UPI QR)"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        If provided, customers will scan this custom QR code instead of the auto-generated code.
                      </span>
                    </div>

                    {settingsFormData.customQrUrl && (
                      <div className="p-3 rounded-lg bg-black/40 border border-white/10 flex items-center gap-3">
                        <img
                          src={settingsFormData.customQrUrl}
                          alt="Custom QR Preview"
                          className="w-16 h-16 object-contain rounded bg-white p-1"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <div className="text-xs text-gray-300">
                          <span className="text-emerald-400 font-bold block">✓ Custom QR URL Configured</span>
                          Preview shown on the left.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* General Store Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Store Branding & Support Channels
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          STORE NAME
                        </label>
                        <input
                          type="text"
                          value={settingsFormData.storeName}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, storeName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          SUBTITLE
                        </label>
                        <input
                          type="text"
                          value={settingsFormData.subTitle}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, subTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          TELEGRAM SUPPORT USERNAME
                        </label>
                        <input
                          type="text"
                          value={settingsFormData.telegramUsername}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, telegramUsername: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          WHATSAPP SUPPORT NUMBER
                        </label>
                        <input
                          type="text"
                          value={settingsFormData.supportWhatsapp}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, supportWhatsapp: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          SUPPORT HELPLINE / PHONE
                        </label>
                        <input
                          type="text"
                          value={settingsFormData.supportPhone}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, supportPhone: e.target.value })}
                          placeholder="+91 80000 12345"
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          SUPPORT WORKING HOURS & SLA
                        </label>
                        <input
                          type="text"
                          value={settingsFormData.supportTiming}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, supportTiming: e.target.value })}
                          placeholder="24/7 Live Support • 10 Mins SLA"
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          OFFICIAL SUPPORT EMAIL
                        </label>
                        <input
                          type="email"
                          value={settingsFormData.supportEmail}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, supportEmail: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          TOP ANNOUNCEMENT BANNER
                        </label>
                        <input
                          type="text"
                          value={settingsFormData.announcementBanner}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, announcementBanner: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  >
                    SAVE MERCHANT QR & SETTINGS
                  </button>
                </form>
              )}

              {/* TAB 4: USERS MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Total Registered Users: {users.length}</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#121424] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold text-gray-400">
                        <tr>
                          <th className="p-3">User</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Wallet Balance</th>
                          <th className="p-3">Total Orders</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td className="p-3">
                              <div className="font-bold text-white">{u.name}</div>
                              <div className="text-[10px] text-gray-400">{u.email}</div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-gray-300'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-emerald-400">
                              ₹{u.walletBalance.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-gray-300 font-mono">
                              {u.totalOrders}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                                {u.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT VOUCHER MODAL */}
        {isVoucherFormOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#141628] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-bold text-white text-sm">
                  {editingVoucherId ? 'EDIT VOUCHER OFFER' : 'ADD NEW DIGITAL VOUCHER'}
                </h4>
                <button
                  onClick={() => setIsVoucherFormOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVoucher} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">VOUCHER PRODUCT NAME</label>
                  <input
                    type="text"
                    required
                    value={voucherFormData.name}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, name: e.target.value })}
                    placeholder="e.g. Amazon Pay Shopping Gift Voucher"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">BRAND</label>
                    <input
                      type="text"
                      required
                      value={voucherFormData.brand}
                      onChange={(e) => setVoucherFormData({ ...voucherFormData, brand: e.target.value })}
                      placeholder="e.g. Amazon, Steam, Netflix"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">CATEGORY</label>
                    <select
                      value={voucherFormData.category}
                      onChange={(e) => setVoucherFormData({ ...voucherFormData, category: e.target.value as VoucherCategory })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white"
                    >
                      <option value="shopping">Shopping</option>
                      <option value="gaming">Gaming</option>
                      <option value="streaming">Streaming</option>
                      <option value="food">Food & Dining</option>
                      <option value="tech">Tech & Software</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">FACE VALUE (₹)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={voucherFormData.faceValue}
                      onChange={(e) => setVoucherFormData({ ...voucherFormData, faceValue: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">SELLING PRICE (₹)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={voucherFormData.sellingPrice}
                      onChange={(e) => setVoucherFormData({ ...voucherFormData, sellingPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">STOCK UNITS</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={voucherFormData.stock}
                      onChange={(e) => setVoucherFormData({ ...voucherFormData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">VALIDITY</label>
                    <input
                      type="text"
                      required
                      value={voucherFormData.validity}
                      onChange={(e) => setVoucherFormData({ ...voucherFormData, validity: e.target.value })}
                      placeholder="e.g. 365 Days"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">BADGES (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={voucherFormData.badges}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, badges: e.target.value })}
                    placeholder="FEATURED, 15% OFF, INSTANT CODE"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">REDEMPTION GUIDE</label>
                  <textarea
                    rows={2}
                    value={voucherFormData.redemptionGuide}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, redemptionGuide: e.target.value })}
                    placeholder="Redeem code in official mobile app or brand checkout page."
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsVoucherFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold"
                  >
                    Save Voucher
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Custom Card Delivery Verification Modal */}
        {verifyingOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg bg-[#0e101d] border border-emerald-500/40 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.25)] overflow-hidden my-4">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#141628]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    VERIFY & DELIVER CARD DETAILS (कार्ड डीटेल्स भेजें)
                  </h3>
                </div>
                <button
                  onClick={() => setVerifyingOrder(null)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                  Order: <b className="font-mono text-white">{verifyingOrder.orderNumber}</b> • Customer: <b className="text-white">{verifyingOrder.userName}</b> ({verifyingOrder.userPhone || verifyingOrder.userEmail})
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                      ACCOUNT NO. / CARD NUMBER <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cardDeliveryForm.accountNo}
                      onChange={(e) => setCardDeliveryForm({ ...cardDeliveryForm, accountNo: e.target.value })}
                      placeholder="5172/5258/4406/1926"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                        CCV <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cardDeliveryForm.ccv}
                        onChange={(e) => setCardDeliveryForm({ ...cardDeliveryForm, ccv: e.target.value })}
                        placeholder="102"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                        MM/YY (EXPIRY) <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cardDeliveryForm.expiry}
                        onChange={(e) => setCardDeliveryForm({ ...cardDeliveryForm, expiry: e.target.value })}
                        placeholder="08/31"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                        CARD HOLDER NAME
                      </label>
                      <input
                        type="text"
                        value={cardDeliveryForm.cardHolderName}
                        onChange={(e) => setCardDeliveryForm({ ...cardDeliveryForm, cardHolderName: e.target.value })}
                        placeholder="AYUSH"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                        COUNTRY & CITY
                      </label>
                      <input
                        type="text"
                        value={cardDeliveryForm.country}
                        onChange={(e) => setCardDeliveryForm({ ...cardDeliveryForm, country: e.target.value })}
                        placeholder="India delhi"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Slip Preview */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Customer Card Slip Preview:</span>
                  <div className="p-3 rounded-xl bg-black/70 border border-emerald-500/30 font-mono text-emerald-300 text-xs whitespace-pre-wrap select-all">
                    {`╭━━━━━━━━━━━━━━━━━━━━╮\n      💳 CARD DETAILS\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n➤ ACCOUNT NO.\n   ${cardDeliveryForm.accountNo} ✅\n\n➤ CCV\n   ${cardDeliveryForm.ccv} ✅\n\n➤ MM/YY\n   ${cardDeliveryForm.expiry} ✅\n\n  Card Holder name — ${cardDeliveryForm.cardHolderName || 'AYUSH'}\n\n  Country ${cardDeliveryForm.country || 'India delhi'}\n╭━━━━━━━━━━━━━━━━━━━━╮\n        VERIFIED ✅\n╰━━━━━━━━━━━━━━━━━━━━╯`}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setVerifyingOrder(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVerifyOrder(verifyingOrder.id, cardDeliveryForm)}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    Release Card Details To Customer ✅
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
