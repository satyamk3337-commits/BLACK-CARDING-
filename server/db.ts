import fs from 'fs';
import path from 'path';
import { VoucherProduct, Order, User, StoreSettings, DashboardStats } from '../src/types.js';

const DB_FILE = path.join(process.cwd(), 'data_store.json');

interface DatabaseSchema {
  vouchers: VoucherProduct[];
  orders: Order[];
  users: User[];
  settings: StoreSettings;
}

const INITIAL_VOUCHERS: VoucherProduct[] = [
  {
    id: 'card-1',
    name: 'American Express Platinum Card',
    category: 'shopping',
    brand: 'American Express',
    faceValue: 155000,
    sellingPrice: 3250,
    stock: 6,
    validity: '08/2031',
    stockStatus: 'in_stock',
    badges: ['TRUSTED CARD'],
    redemptionGuide: 'Card credentials, full 15-digit number, 4-digit CID, and billing details provided upon verified payment approval.',
    voucherTheme: 'amber-gold',
    description: 'High-tier verified American Express Platinum with ₹155,000 available balance.',
    createdAt: new Date().toISOString(),
    cardNetwork: 'AMEX',
    cardTitle: 'AMERICAN EXPRESS',
    cardNumberMasked: '•••• •••••• •6545',
    cardSecurityCode: '))) 7997',
    cardHolder: 'MATTHEW S. PRESCOTT',
    cardLimitFormatted: '₹ 155000 Balance',
    refundPolicy: '100% Refundable',
    instantRelease: '10 Mins SLA',
    inPool: 6
  },
  {
    id: 'card-2',
    name: 'American Express Business Plus Card',
    category: 'shopping',
    brand: 'American Express',
    faceValue: 195000,
    sellingPrice: 3700,
    stock: 11,
    validity: '06/2030',
    stockStatus: 'in_stock',
    badges: ['UNLIMITED ACCESS'],
    redemptionGuide: 'Corporate line American Express Business Plus card credentials delivered upon payment verification.',
    voucherTheme: 'cyber-blue',
    description: 'Commercial line American Express Business Plus card with verified active balance.',
    createdAt: new Date().toISOString(),
    cardNetwork: 'AMEX',
    cardTitle: 'AMERICAN EXPRESS BUSINESS PLUS',
    cardNumberMasked: '•••• •••••• •6581',
    cardSecurityCode: '))) 7997',
    cardHolder: 'VICTORIA L. WINCHESTER',
    cardLimitFormatted: '₹ 195000 Balance',
    refundPolicy: '100% Refundable',
    instantRelease: '10 Mins SLA',
    inPool: 11
  },
  {
    id: 'card-3',
    name: 'American Express Centurion Card',
    category: 'shopping',
    brand: 'American Express',
    faceValue: 350000,
    sellingPrice: 4200,
    stock: 16,
    validity: '03/2029',
    stockStatus: 'in_stock',
    badges: ['ALL UNLIMITED ACCESS', '★ FEATURED'],
    redemptionGuide: 'Unlimited access Centurion card with ₹350,000 balance released automatically upon admin approval.',
    voucherTheme: 'emerald-neon',
    description: 'Centurion American Express charge card with ₹350,000 limit.',
    createdAt: new Date().toISOString(),
    cardNetwork: 'AMEX',
    cardTitle: 'AMERICAN EXPRESS',
    cardNumberMasked: '•••• •••••• •4062',
    cardSecurityCode: '))) 7997',
    cardHolder: 'JAMESON L. CHASE',
    cardLimitFormatted: '₹ 350000 Balance',
    refundPolicy: '100% Refundable',
    instantRelease: '10 Mins SLA',
    inPool: 16
  },
  {
    id: 'card-4',
    name: 'Visa Signature Executive Card',
    category: 'shopping',
    brand: 'Visa',
    faceValue: 3320,
    sellingPrice: 1900,
    stock: 12,
    validity: '04/2029',
    stockStatus: 'in_stock',
    badges: [],
    redemptionGuide: '16-digit card number, CVV2, and expiration date issued instantly upon payment confirmation.',
    voucherTheme: 'cyber-blue',
    description: 'Verified Visa debit line with ₹3,320 balance and 10 mins SLA.',
    createdAt: new Date().toISOString(),
    cardNetwork: 'VISA',
    cardTitle: 'VISA',
    cardNumberMasked: '•••• •••• •••• 8565',
    cardSecurityCode: '8565',
    cardHolder: 'NEELAM K. PATEL',
    cardLimitFormatted: '₹3,320 Balance',
    refundPolicy: '100% Refundable',
    instantRelease: '10 Mins SLA',
    inPool: 12
  },
  {
    id: 'card-5',
    name: 'Mastercard World Elite Bronze Card',
    category: 'shopping',
    brand: 'Mastercard',
    faceValue: 1660,
    sellingPrice: 1450,
    stock: 8,
    validity: '09/2028',
    stockStatus: 'in_stock',
    badges: [],
    redemptionGuide: 'Mastercard World Elite details provided with instant replacement guarantee.',
    voucherTheme: 'amber-gold',
    description: 'Mastercard World Elite with ₹1,660 available balance.',
    createdAt: new Date().toISOString(),
    cardNetwork: 'MASTERCARD',
    cardTitle: 'MASTERCARD',
    cardNumberMasked: '•••• •••• •••• 2878',
    cardSecurityCode: '2878',
    cardHolder: 'GAURAV S. MALHOTRA',
    cardLimitFormatted: '₹1,660 Balance',
    refundPolicy: 'Instant Replacement',
    instantRelease: '10 Mins SLA',
    inPool: 8
  },
  {
    id: 'card-6',
    name: 'Visa Platinum International Card',
    category: 'shopping',
    brand: 'Visa',
    faceValue: 8300,
    sellingPrice: 2400,
    stock: 9,
    validity: '01/2031',
    stockStatus: 'in_stock',
    badges: [],
    redemptionGuide: 'Visa Platinum credentials released upon payment transaction verification.',
    voucherTheme: 'cyber-blue',
    description: 'Visa Platinum International card with ₹8,300 balance.',
    createdAt: new Date().toISOString(),
    cardNetwork: 'VISA',
    cardTitle: 'VISA',
    cardNumberMasked: '•••• •••• •••• 1916',
    cardSecurityCode: '1916',
    cardHolder: 'DEVENDRA CHOUDHARY',
    cardLimitFormatted: '₹8,300 Balance',
    refundPolicy: '100% Refundable',
    instantRelease: '10 Mins SLA',
    inPool: 9
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Verified Customer',
    email: 'customer@voucherhub.io',
    phone: '+91 98765 43210',
    walletBalance: 2500,
    role: 'user',
    totalOrders: 2,
    totalSpent: 1700,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-2',
    name: 'Pro Gamer',
    email: 'gamer@voucherhub.io',
    phone: '+91 98111 22334',
    walletBalance: 850,
    role: 'user',
    totalOrders: 1,
    totalSpent: 1999,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-3',
    name: 'System Admin',
    email: 'admin@voucherhub.io',
    phone: '+91 99999 88888',
    walletBalance: 50000,
    role: 'admin',
    totalOrders: 0,
    totalSpent: 0,
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'VCH-88219',
    voucherId: 'card-1',
    voucherName: 'American Express Platinum Card',
    category: 'shopping',
    faceValue: 155000,
    amount: 3250,
    userId: 'usr-1',
    userEmail: 'customer@darkcarding.io',
    userName: 'AYUSH',
    paymentMethod: 'upi_qr',
    paymentDetails: {
      utrNumber: '328491028341',
      upiId: 'customer@okaxis',
      slipNote: 'Verified via Gateway Switch'
    },
    status: 'paid',
    deliveredVoucher: {
      voucherCode: '5172/5258/4406/1926',
      voucherPin: '102',
      brand: 'American Express',
      faceValue: 155000,
      expiryDate: '08/31',
      redemptionUrl: 'Instant Card Credentials',
      instructions: 'Card credentials verified and active. Valid in India delhi.',
      accountNo: '5172/5258/4406/1926',
      ccv: '102',
      expiry: '08/31',
      cardHolderName: 'AYUSH',
      country: 'India delhi',
      formattedCardSlip: `╭━━━━━━━━━━━━━━━━━━━━╮\n      💳 CARD DETAILS\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n➤ ACCOUNT NO.\n   5172/5258/4406/1926 ✅\n\n➤ CCV\n   102 ✅\n\n➤ MM/YY\n   08/31 ✅\n\n  Card Holder name — AYUSH\n\n  Country India delhi\n╭━━━━━━━━━━━━━━━━━━━━╮\n        VERIFIED ✅\n╰━━━━━━━━━━━━━━━━━━━━╯`
    },
    slaDeadline: '10 Mins',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    approvedAt: new Date(Date.now() - 3500000).toISOString(),
    adminNotes: 'Verified & Released by Admin RAJAJI'
  },
  {
    id: 'ord-102',
    orderNumber: 'VCH-99412',
    voucherId: 'card-2',
    voucherName: 'American Express Business Plus Card',
    category: 'shopping',
    faceValue: 195000,
    amount: 3700,
    userId: 'usr-1',
    userEmail: 'customer@darkcarding.io',
    userName: 'Raja Customer',
    paymentMethod: 'upi_qr',
    paymentDetails: {
      utrNumber: '409182390192',
      upiId: 'raja@paytm',
      slipNote: 'Pending admin gateway confirmation'
    },
    status: 'pending_payment',
    slaDeadline: '10 Mins',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    adminNotes: 'Awaiting admin verification'
  }
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'DARK CARDING',
  subTitle: 'Digital Card & Virtual Vault',
  merchantUpiId: 'merchant.pay@upi',
  merchantName: 'DARK CARDING Official Merchant',
  customQrUrl: '', // Admin can set a custom QR image URL or fallback to dynamic UPI QR
  telegramUsername: 'lottaygent',
  supportEmail: 'support@darkcarding.io',
  supportPhone: '+91 80000 12345',
  announcementBanner: '⚡ Automated Delivery • All cards come with 100% Refundable Guarantee & Instant Release!',
  announcementEnabled: true,
  defaultSlaMins: 10,
  adminPassword: 'RAJAJI', // Custom Admin password requested by user
  paymentGatewayName: 'Licensed UPI & Digital Merchant Gateway'
};

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.vouchers && parsed.orders && parsed.settings) {
          // Ensure admin password is set to RAJAJI if not set
          if (!parsed.settings.adminPassword || parsed.settings.adminPassword === '8888') {
            parsed.settings.adminPassword = 'RAJAJI';
          }
          if (parsed.settings.storeName === 'VoucherHub') {
            parsed.settings.storeName = 'DARK CARDING';
          }
          if (parsed.settings.telegramUsername === 'voucherhub_support') {
            parsed.settings.telegramUsername = 'lottaygent';
          }
          // If vouchers don't have card visual fields, upgrade to the 6 screenshot cards
          if (!parsed.vouchers[0] || !parsed.vouchers[0].cardNumberMasked) {
            parsed.vouchers = INITIAL_VOUCHERS;
          }
          // Ensure orders use the updated card details format
          if (!parsed.orders[0] || !parsed.orders[0].deliveredVoucher?.accountNo) {
            parsed.orders = INITIAL_ORDERS;
          }
          if (!parsed.settings.supportWhatsapp) {
            parsed.settings.supportWhatsapp = '+91 98765 43210';
          }
          if (!parsed.settings.supportTiming) {
            parsed.settings.supportTiming = '24/7 Live Support • 10 Mins SLA';
          }
          this.saveDatabase(parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load database from file, using initial data:', e);
    }

    const initial: DatabaseSchema = {
      vouchers: INITIAL_VOUCHERS,
      orders: INITIAL_ORDERS,
      users: INITIAL_USERS,
      settings: INITIAL_SETTINGS
    };
    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database file:', e);
    }
  }

  // --- VOUCHERS API ---
  public getVouchers(): VoucherProduct[] {
    return this.data.vouchers;
  }

  public getVoucherById(id: string): VoucherProduct | undefined {
    return this.data.vouchers.find(v => v.id === id);
  }

  public addVoucher(data: Omit<VoucherProduct, 'id' | 'createdAt'>): VoucherProduct {
    const newVoucher: VoucherProduct = {
      ...data,
      id: `vouch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    this.data.vouchers.unshift(newVoucher);
    this.saveDatabase();
    return newVoucher;
  }

  public updateVoucher(id: string, updates: Partial<VoucherProduct>): VoucherProduct | null {
    const idx = this.data.vouchers.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.vouchers[idx] = { ...this.data.vouchers[idx], ...updates };
    this.saveDatabase();
    return this.data.vouchers[idx];
  }

  public deleteVoucher(id: string): boolean {
    const prevLen = this.data.vouchers.length;
    this.data.vouchers = this.data.vouchers.filter(v => v.id !== id);
    if (this.data.vouchers.length !== prevLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- ORDERS API ---
  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId || o.userEmail === userId);
    }
    return this.data.orders;
  }

  public createOrder(params: {
    voucherId: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    paymentMethod: 'upi_qr' | 'gateway' | 'crypto';
    paymentDetails?: { utrNumber?: string; upiId?: string; txHash?: string; slipNote?: string };
  }): Order {
    const voucher = this.getVoucherById(params.voucherId);
    if (!voucher) throw new Error('Voucher product not found');

    const orderNumber = `VCH-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      voucherId: voucher.id,
      voucherName: voucher.name,
      category: voucher.category,
      faceValue: voucher.faceValue,
      amount: voucher.sellingPrice,
      userId: params.userId,
      userEmail: params.userEmail,
      userName: params.userName,
      userPhone: params.userPhone,
      paymentMethod: params.paymentMethod,
      paymentDetails: params.paymentDetails || {},
      status: 'pending_payment', // Customer card buy kare to pending show kare!
      slaDeadline: '10 Mins',
      createdAt: new Date().toISOString()
    };

    // Decrement stock
    if (voucher.stock > 0) {
      voucher.stock -= 1;
      if (voucher.stock === 0) {
        voucher.stockStatus = 'out_of_stock';
      }
    }

    this.data.orders.unshift(newOrder);
    this.saveDatabase();
    return newOrder;
  }

  public submitOrderPaymentDetails(
    orderId: string,
    details: { utrNumber?: string; upiId?: string; txHash?: string; slipNote?: string }
  ): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.paymentDetails = { ...order.paymentDetails, ...details };
    // Remains pending_payment until admin or authorized gateway confirms
    order.status = 'pending_payment';
    this.saveDatabase();
    return order;
  }

  public updateOrderStatus(
    orderId: string,
    status: Order['status'],
    adminNotes?: string,
    customCardDetails?: { accountNo?: string; ccv?: string; expiry?: string; cardHolderName?: string; country?: string }
  ): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = status;
    if (adminNotes) order.adminNotes = adminNotes;

    // Admin verify dega to card details milega!
    if (status === 'paid') {
      const voucher = this.getVoucherById(order.voucherId);
      const isAmex = voucher?.cardNetwork === 'AMEX' || voucher?.brand?.toLowerCase().includes('amex');

      let accountNo = customCardDetails?.accountNo?.trim();
      if (!accountNo) {
        if (voucher?.cardNumberMasked && !voucher.cardNumberMasked.includes('••')) {
          accountNo = voucher.cardNumberMasked;
        } else {
          const prefix = isAmex ? '3772' : '5172';
          const p2 = Math.floor(1000 + Math.random() * 9000).toString();
          const p3 = Math.floor(1000 + Math.random() * 9000).toString();
          const p4 = voucher?.cardNumberMasked
            ? voucher.cardNumberMasked.replace(/[^0-9]/g, '').slice(-4) || '1926'
            : '1926';
          accountNo = `${prefix}/${p2}/${p3}/${p4}`;
        }
      }

      const ccv = customCardDetails?.ccv?.trim() || (isAmex ? '7997' : Math.floor(100 + Math.random() * 900).toString());
      const expiry = customCardDetails?.expiry?.trim() || (voucher?.validity ? voucher.validity.replace(/20/g, '') : '08/31');
      const cardHolderName = customCardDetails?.cardHolderName?.trim() || order.userName || voucher?.cardHolder || 'AYUSH';
      const country = customCardDetails?.country?.trim() || 'India delhi';

      const formattedCardSlip = `╭━━━━━━━━━━━━━━━━━━━━╮\n      💳 CARD DETAILS\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n➤ ACCOUNT NO.\n   ${accountNo} ✅\n\n➤ CCV\n   ${ccv} ✅\n\n➤ MM/YY\n   ${expiry} ✅\n\n  Card Holder name — ${cardHolderName}\n\n  Country ${country}\n╭━━━━━━━━━━━━━━━━━━━━╮\n        VERIFIED ✅\n╰━━━━━━━━━━━━━━━━━━━━╯`;

      order.deliveredVoucher = {
        voucherCode: accountNo,
        voucherPin: ccv,
        brand: voucher?.brand || 'Verified Card',
        faceValue: order.faceValue,
        expiryDate: expiry,
        redemptionUrl: 'Instant Card Credentials',
        instructions: `Card credentials verified and active. Valid in ${country}.`,
        accountNo,
        ccv,
        expiry,
        cardHolderName,
        country,
        formattedCardSlip
      };
      order.approvedAt = new Date().toISOString();
    }

    this.saveDatabase();
    return order;
  }

  // --- USERS API ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public createUser(user: Partial<User> & { name: string; email: string }): User {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      walletBalance: user.walletBalance || 0,
      role: user.role || 'user',
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    Object.assign(user, updates);
    this.saveDatabase();
    return user;
  }

  public adjustUserBalance(id: string, delta: number): User | null {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    user.walletBalance = Math.max(0, user.walletBalance + delta);
    this.saveDatabase();
    return user;
  }

  // --- SETTINGS API ---
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveDatabase();
    return this.data.settings;
  }

  // --- STATS ---
  public getStats(): DashboardStats {
    const paidOrders = this.data.orders.filter(o => o.status === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
    const pendingOrders = this.data.orders.filter(o => o.status === 'pending_payment').length;
    const stockCount = this.data.vouchers.reduce((sum, v) => sum + v.stock, 0);

    return {
      totalRevenue,
      totalOrders: this.data.orders.length,
      activeVouchers: this.data.vouchers.filter(v => v.stockStatus === 'in_stock').length,
      totalUsers: this.data.users.length,
      pendingOrders,
      stockCount
    };
  }

  public resetToDefaults() {
    this.data = {
      vouchers: INITIAL_VOUCHERS,
      orders: INITIAL_ORDERS,
      users: INITIAL_USERS,
      settings: INITIAL_SETTINGS
    };
    this.saveDatabase();
  }
}

export const db = new DatabaseManager();
