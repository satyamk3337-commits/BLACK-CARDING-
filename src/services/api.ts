import { VoucherProduct, Order, User, StoreSettings, DashboardStats } from '../types';

export const api = {
  // Settings
  async getSettings(): Promise<{ success: boolean; settings: StoreSettings }> {
    const res = await fetch('/api/settings');
    return res.json();
  },

  async updateSettings(updates: Partial<StoreSettings>, password: string): Promise<{ success: boolean; settings: StoreSettings; error?: string }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates, password })
    });
    return res.json();
  },

  async verifyAdminPassword(password: string): Promise<{ success: boolean; authorized?: boolean; error?: string }> {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return res.json();
  },

  // Vouchers
  async getVouchers(params?: { category?: string; inStock?: boolean }): Promise<{ success: boolean; vouchers: VoucherProduct[] }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.inStock) query.set('inStock', 'true');
    const res = await fetch(`/api/vouchers?${query.toString()}`);
    return res.json();
  },

  async addVoucher(data: Omit<VoucherProduct, 'id' | 'createdAt'>): Promise<{ success: boolean; voucher: VoucherProduct; error?: string }> {
    const res = await fetch('/api/vouchers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateVoucher(id: string, updates: Partial<VoucherProduct>): Promise<{ success: boolean; voucher: VoucherProduct; error?: string }> {
    const res = await fetch(`/api/vouchers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteVoucher(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const res = await fetch(`/api/vouchers/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Orders
  async getOrders(userId?: string): Promise<{ success: boolean; orders: Order[] }> {
    const url = userId ? `/api/orders?userId=${encodeURIComponent(userId)}` : '/api/orders';
    const res = await fetch(url);
    return res.json();
  },

  async createOrder(data: {
    voucherId: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    paymentMethod: Order['paymentMethod'];
    paymentDetails?: Order['paymentDetails'];
  }): Promise<{ success: boolean; order: Order; error?: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async verifyPayment(orderId: string, details: {
    utrNumber?: string;
    upiId?: string;
    txHash?: string;
    slipNote?: string;
  }): Promise<{ success: boolean; order: Order; message?: string; error?: string }> {
    const res = await fetch(`/api/orders/${orderId}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return res.json();
  },

  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    adminNotes?: string,
    cardDetails?: { accountNo?: string; ccv?: string; expiry?: string; cardHolderName?: string; country?: string }
  ): Promise<{ success: boolean; order: Order; error?: string }> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes, cardDetails })
    });
    return res.json();
  },

  // Users
  async getUsers(): Promise<{ success: boolean; users: User[] }> {
    const res = await fetch('/api/users');
    return res.json();
  },

  async createUser(data: { name: string; email: string; phone?: string; role?: 'user' | 'admin' }): Promise<{ success: boolean; user: User; error?: string }> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateUser(id: string, updates: Partial<User>): Promise<{ success: boolean; user: User; error?: string }> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async adjustUserBalance(id: string, delta: number): Promise<{ success: boolean; user: User; error?: string }> {
    const res = await fetch(`/api/users/${id}/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta })
    });
    return res.json();
  },

  // Stats
  async getStats(): Promise<{ success: boolean; stats: DashboardStats }> {
    const res = await fetch('/api/stats');
    return res.json();
  },

  // Reset demo db
  async resetDb(password: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const res = await fetch('/api/reset-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return res.json();
  }
};
