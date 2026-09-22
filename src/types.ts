export type VoucherCategory = 'shopping' | 'gaming' | 'streaming' | 'food' | 'tech';

export type VoucherTheme = 
  | 'amber-gold'
  | 'purple-indigo'
  | 'emerald-neon'
  | 'cyber-blue'
  | 'ruby-red'
  | 'sunset-orange';

export interface VoucherProduct {
  id: string;
  name: string;
  category: VoucherCategory;
  brand: string;
  faceValue: number;
  sellingPrice: number;
  stock: number;
  validity: string;
  stockStatus: 'in_stock' | 'out_of_stock';
  badges: string[];
  redemptionGuide: string;
  voucherTheme: VoucherTheme;
  description: string;
  createdAt: string;

  // Visual card attributes matching screenshot
  cardNetwork?: 'AMEX' | 'VISA' | 'MASTERCARD';
  cardTitle?: string;
  cardNumberMasked?: string;
  cardHolder?: string;
  cardSecurityCode?: string;
  cardLimitFormatted?: string;
  refundPolicy?: string;
  instantRelease?: string;
  inPool?: number;
}

export type OrderStatus = 'pending_payment' | 'paid' | 'rejected' | 'refunded';

export interface DeliveredVoucherDetails {
  voucherCode: string;
  voucherPin: string;
  brand: string;
  faceValue: number;
  expiryDate: string;
  redemptionUrl: string;
  instructions: string;

  // Card details delivered after buy & admin verification
  accountNo?: string;
  ccv?: string;
  expiry?: string;
  cardHolderName?: string;
  country?: string;
  formattedCardSlip?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  voucherId: string;
  voucherName: string;
  category: VoucherCategory;
  faceValue: number;
  amount: number;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  paymentMethod: 'upi_qr' | 'gateway' | 'crypto';
  paymentDetails: {
    utrNumber?: string;
    upiId?: string;
    txHash?: string;
    slipNote?: string;
    gatewayTxnId?: string;
  };
  status: OrderStatus;
  deliveredVoucher?: DeliveredVoucherDetails;
  slaDeadline: string;
  createdAt: string;
  approvedAt?: string;
  adminNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  role: 'admin' | 'user';
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  subTitle: string;
  merchantUpiId: string;
  merchantName: string;
  customQrUrl?: string; // QR code image URL or custom QR generator
  telegramUsername: string;
  supportEmail: string;
  supportPhone?: string;
  supportWhatsapp?: string;
  supportTiming?: string;
  announcementBanner: string;
  announcementEnabled: boolean;
  defaultSlaMins: number;
  adminPassword: string; // Set to "RAJAJI"
  paymentGatewayName: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeVouchers: number;
  totalUsers: number;
  pendingOrders: number;
  stockCount: number;
}
