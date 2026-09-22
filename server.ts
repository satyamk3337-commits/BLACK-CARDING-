import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'VoucherHub Digital Voucher Marketplace', time: new Date().toISOString() });
});

// Settings API
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    // Do not leak adminPassword to client
    const safeSettings = { ...settings };
    delete (safeSettings as any).adminPassword;
    res.json({ success: true, settings: safeSettings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/settings', (req, res) => {
  try {
    const { updates, password } = req.body;
    const settings = db.getSettings();
    const authorized = password && (password.toUpperCase() === settings.adminPassword.toUpperCase() || password === 'RAJAJI');
    if (!authorized) {
      return res.status(403).json({ success: false, error: 'Invalid admin authorization password' });
    }
    const updated = db.updateSettings(updates);
    const safeSettings = { ...updated };
    delete (safeSettings as any).adminPassword;
    res.json({ success: true, settings: safeSettings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Auth Verify (Password: RAJAJI)
app.post('/api/admin/auth', (req, res) => {
  const { password, pin } = req.body;
  const inputPass = password || pin;
  const settings = db.getSettings();
  if (
    inputPass && 
    (inputPass.toUpperCase() === settings.adminPassword.toUpperCase() || inputPass.toUpperCase() === 'RAJAJI')
  ) {
    res.json({ success: true, authorized: true, role: 'admin' });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect Admin Password. Access Denied.' });
  }
});

// Vouchers API (CRUD)
app.get('/api/vouchers', (req, res) => {
  try {
    const { category, inStock } = req.query;
    let vouchers = db.getVouchers();

    if (category && category !== 'all') {
      vouchers = vouchers.filter(v => v.category === category);
    }
    if (inStock === 'true') {
      vouchers = vouchers.filter(v => v.stockStatus === 'in_stock');
    }

    res.json({ success: true, vouchers, cards: vouchers }); // cards included for compatibility
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Backwards compatibility endpoint
app.get('/api/cards', (req, res) => {
  try {
    const vouchers = db.getVouchers();
    res.json({ success: true, cards: vouchers, vouchers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/vouchers/:id', (req, res) => {
  const voucher = db.getVoucherById(req.params.id);
  if (!voucher) return res.status(404).json({ success: false, error: 'Voucher not found' });
  res.json({ success: true, voucher });
});

app.post('/api/vouchers', (req, res) => {
  try {
    const voucherData = req.body;
    if (!voucherData.name || !voucherData.sellingPrice || !voucherData.faceValue) {
      return res.status(400).json({ success: false, error: 'Missing required voucher fields' });
    }
    const newVoucher = db.addVoucher(voucherData);
    res.status(201).json({ success: true, voucher: newVoucher });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/vouchers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateVoucher(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Voucher not found' });
    res.json({ success: true, voucher: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/vouchers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ok = db.deleteVoucher(id);
    if (!ok) return res.status(404).json({ success: false, error: 'Voucher not found' });
    res.json({ success: true, message: 'Voucher deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Orders API
app.get('/api/orders', (req, res) => {
  try {
    const { userId } = req.query;
    const orders = db.getOrders(userId as string | undefined);
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { voucherId, cardId, userId, userName, userEmail, userPhone, paymentMethod, paymentDetails } = req.body;
    const selectedVoucherId = voucherId || cardId;
    if (!selectedVoucherId || !userName || !userEmail) {
      return res.status(400).json({ success: false, error: 'Missing required order fields' });
    }

    const order = db.createOrder({
      voucherId: selectedVoucherId,
      userId: userId || 'usr-1',
      userName,
      userEmail,
      userPhone,
      paymentMethod: paymentMethod || 'upi_qr',
      paymentDetails
    });

    res.status(201).json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders/:id/verify-payment', (req, res) => {
  try {
    const { id } = req.params;
    const { utrNumber, upiId, txHash, slipNote } = req.body;

    if (!utrNumber && !txHash) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 12-digit UTR number or Transaction Reference.' });
    }

    const updated = db.submitOrderPaymentDetails(id, {
      utrNumber,
      upiId,
      txHash,
      slipNote
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, order: updated, message: 'Payment reference submitted. Status is Pending until verification.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, cardDetails } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'Status is required' });

    const updated = db.updateOrderStatus(id, status, adminNotes, cardDetails);
    if (!updated) return res.status(404).json({ success: false, error: 'Order not found' });

    res.json({ success: true, order: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Users Management API
app.get('/api/users', (req, res) => {
  try {
    const users = db.getUsers();
    res.json({ success: true, users });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }
    const user = db.createUser({ name, email, phone, role });
    res.status(201).json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateUser(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users/:id/balance', (req, res) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;
    if (typeof delta !== 'number') return res.status(400).json({ success: false, error: 'Delta must be a number' });

    const updated = db.adjustUserBalance(id, delta);
    if (!updated) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Dashboard Stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset DB Demo
app.post('/api/reset-db', (req, res) => {
  try {
    const { password, pin } = req.body;
    const settings = db.getSettings();
    const inputPass = password || pin;
    if (
      !inputPass || 
      (inputPass.toUpperCase() !== settings.adminPassword.toUpperCase() && inputPass.toUpperCase() !== 'RAJAJI')
    ) {
      return res.status(403).json({ success: false, error: 'Invalid admin password' });
    }
    db.resetToDefaults();
    res.json({ success: true, message: 'Database reset to default full voucher catalog' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Vite Middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
