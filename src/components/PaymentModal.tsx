import React, { useState, useEffect } from 'react';
import { X, Check, Copy, ShieldCheck, QrCode, AlertCircle, Clock, Sparkles, Gift, ChevronRight, CheckCircle2, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { VoucherProduct, Order, StoreSettings, DeliveredVoucherDetails } from '../types';
import { api } from '../services/api';

interface PaymentModalProps {
  voucher: VoucherProduct | null;
  settings: StoreSettings;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onOpenOrders: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  voucher,
  settings,
  onClose,
  onOrderSuccess,
  onOpenOrders,
}) => {
  if (!voucher) return null;

  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'gateway' | 'crypto'>('upi_qr');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('+91 ');
  const [utrNumber, setUtrNumber] = useState('');
  const [slipNote, setSlipNote] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pending order view state: Customer card buy kare to pending show kare!
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Countdown timer for payment session (10 mins)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate UPI QR Code (if custom QR url is not provided by Admin)
  useEffect(() => {
    if (settings.customQrUrl && settings.customQrUrl.trim().length > 0) {
      setQrCodeDataUrl(settings.customQrUrl.trim());
      return;
    }

    const upiString = `upi://pay?pa=${settings.merchantUpiId}&pn=${encodeURIComponent(
      settings.merchantName
    )}&am=${voucher.sellingPrice}&cu=INR&tn=Voucher-${voucher.brand}-${voucher.id}`;

    QRCode.toDataURL(upiString, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0a0b14',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [voucher, settings]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleAutoFillTestUtr = () => {
    const randomUtr = `4${Math.floor(10000000000 + Math.random() * 90000000000)}`;
    setUtrNumber(randomUtr);
    setSlipNote('Instant Bank Transfer App');
    setError(null);
  };

  // Submit Order: Status initially PENDING PAYMENT
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userName.trim() || !userEmail.trim()) {
      setError('Please provide your name and email for digital voucher delivery.');
      return;
    }

    if (paymentMethod === 'upi_qr' && !utrNumber.trim()) {
      setError('Please enter the 12-digit UPI UTR number from your payment app.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order with status 'pending_payment'
      const orderRes = await api.createOrder({
        voucherId: voucher.id,
        userId: 'usr-1',
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        userPhone: userPhone.trim(),
        paymentMethod: paymentMethod,
        paymentDetails: {
          utrNumber: utrNumber.trim(),
          upiId: `${userName.toLowerCase().replace(/\s+/g, '')}@upi`,
          slipNote: slipNote || 'UPI Merchant Payment',
        },
      });

      if (!orderRes.success || !orderRes.order) {
        throw new Error(orderRes.error || 'Failed to initialize order');
      }

      const createdOrder = orderRes.order;

      // 2. Submit payment reference
      await api.verifyPayment(createdOrder.id, {
        utrNumber: utrNumber.trim(),
        slipNote: slipNote || 'UPI Merchant Payment Confirmation',
      });

      setPlacedOrder(createdOrder);
      onOrderSuccess(createdOrder);
    } catch (err: any) {
      setError(err.message || 'Payment processing encountered an error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin or Gateway instant approval simulation button (optional preview helper)
  const handleSimulateGatewayApproval = async () => {
    if (!placedOrder) return;
    setIsSubmitting(true);
    try {
      const res = await api.updateOrderStatus(
        placedOrder.id,
        'paid',
        'Approved by Merchant Gateway Switch'
      );
      if (res.success && res.order) {
        setPlacedOrder(res.order);
        onOrderSuccess(res.order);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err: any) {
      setError(err.message || 'Verification simulation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="payment-gateway-modal"
        className="relative w-full max-w-xl bg-[#0f111e] border border-indigo-500/30 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden my-6"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#141628]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                SECURE CHECKOUT & PAYMENT GATEWAY
              </h3>
              <p className="text-[11px] text-gray-400">
                Official Digital Voucher Issuance • Encrypted Channel
              </p>
            </div>
          </div>

          <button
            id="close-payment-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER STATE: If Order has been placed */}
        {placedOrder ? (
          <div className="p-6 space-y-5">
            {/* If Status is PENDING PAYMENT (As requested: costomer card buy kare to pending show kare) */}
            {placedOrder.status === 'pending_payment' ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ⏳ ORDER STATUS: PENDING PAYMENT VERIFICATION
                </div>

                <h3 className="text-xl font-black text-white">
                  Payment Submitted & Under Review
                </h3>

                <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-bold">{placedOrder.userName}</span>! Order{' '}
                  <span className="text-indigo-400 font-mono font-bold">#{placedOrder.orderNumber}</span> has been created.
                  As per policy, your payment reference (<span className="font-mono text-amber-300">{placedOrder.paymentDetails.utrNumber || 'Submitted'}</span>) is now pending verification.
                </p>

                {/* Info Card */}
                <div className="bg-white/[0.03] border border-amber-500/30 rounded-xl p-4 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-400 border-b border-white/5 pb-2">
                    <span>Product:</span>
                    <span className="text-white font-semibold">{placedOrder.voucherName}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400 border-b border-white/5 pb-2">
                    <span>Amount Paid:</span>
                    <span className="text-emerald-400 font-bold font-mono">₹{placedOrder.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Admin Verification SLA:</span>
                    <span className="text-amber-300 font-semibold">⚡ Within 10 Minutes</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300">
                  💡 <strong>Admin Verification Flow:</strong> Once Admin reviews your UTR in the Admin Panel and clicks <em>Verify & Deliver</em>, your official voucher code and PIN will unlock here and in <strong>My Orders</strong>.
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenOrders();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    VIEW IN MY ORDERS
                  </button>

                  <button
                    onClick={handleSimulateGatewayApproval}
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    title="Simulate instant gateway or admin approval"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SIMULATE INSTANT APPROVAL</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If Status is PAID: Deliver Voucher Code and PIN! */
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-2">
                    <Check className="w-7 h-7 text-emerald-400 stroke-[3]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    PAYMENT CONFIRMED • VOUCHER DELIVERED
                  </span>
                  <h3 className="text-xl font-black text-white mt-2">
                    Here is Your Digital Voucher Code!
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Order #{placedOrder.orderNumber} • Face Value: ₹{placedOrder.faceValue.toLocaleString('en-IN')}
                  </p>
                </div>

                {placedOrder.deliveredVoucher && (
                  <div className="rounded-xl bg-gradient-to-br from-[#161a33] to-[#0c0d18] border border-indigo-500/40 p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="font-bold text-sm text-indigo-300 uppercase flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-emerald-400" />
                        <span>{placedOrder.voucherName}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        OFFICIAL CODE
                      </span>
                    </div>

                    {/* Voucher Code */}
                    <div className="bg-black/50 p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
                          VOUCHER ACTIVATION CODE
                        </div>
                        <div className="font-mono text-base sm:text-lg font-black tracking-wider text-emerald-400 select-all mt-0.5">
                          {placedOrder.deliveredVoucher.voucherCode}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyVoucherCode(placedOrder.deliveredVoucher!.voucherCode)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>

                    {/* PIN & Expiry */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="text-[9px] uppercase text-gray-400">SECURITY PIN</div>
                        <div className="font-mono font-bold text-white text-base mt-0.5">
                          {placedOrder.deliveredVoucher.voucherPin}
                        </div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="text-[9px] uppercase text-gray-400">VALIDITY PERIOD</div>
                        <div className="font-mono font-bold text-emerald-300 text-sm mt-0.5">
                          {placedOrder.deliveredVoucher.expiryDate}
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5 text-[11px] text-gray-300">
                      <div className="font-bold text-white mb-1">Redemption Instructions:</div>
                      <div>{placedOrder.deliveredVoucher.instructions}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenOrders();
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    OPEN MY ORDERS VAULT
                  </button>
                  <button
                    onClick={onClose}
                    className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Payment Form View */
          <form onSubmit={handleSubmitPayment} className="p-5 sm:p-6 space-y-5">
            {/* Voucher Summary Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center font-bold text-white text-xs shadow">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{voucher.name}</div>
                  <div className="text-[11px] text-gray-400">
                    Face Value: <span className="text-white font-bold">₹{voucher.faceValue.toLocaleString('en-IN')}</span> • {voucher.validity}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">PAYABLE AMOUNT</div>
                <div className="text-xl font-black text-white">
                  ₹{voucher.sellingPrice.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                SELECT PAYMENT GATEWAY / UPI METHOD
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                    paymentMethod === 'upi_qr'
                      ? 'bg-indigo-900/40 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-center gap-1">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>UPI MERCHANT QR</span>
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('gateway')}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                    paymentMethod === 'gateway'
                      ? 'bg-indigo-900/40 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">DIRECT NETBANKING / IMPS</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">Instant Banking Switch</div>
                </button>
              </div>
            </div>

            {/* UPI QR Payment Block */}
            {paymentMethod === 'upi_qr' && (
              <div className="rounded-xl bg-[#131526] border border-white/10 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Dynamic or Custom Admin QR Code */}
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-white rounded-xl shadow-lg border-2 border-indigo-500/40">
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="Merchant UPI QR Code"
                          className="w-40 h-40 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          Generating QR...
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1.5 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      Scan with any UPI App
                    </span>
                  </div>

                  {/* QR Details and Copy VPA */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Payment Timer:</span>
                      <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(timeLeft)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-gray-400 font-semibold">
                        MERCHANT UPI ID
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          readOnly
                          value={settings.merchantUpiId}
                          className="w-full text-xs font-mono bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-indigo-200 select-all"
                        />
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-200 shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 space-y-1">
                      <p>1. Scan QR with GPay, PhonePe, Paytm, or BHIM.</p>
                      <p>2. Pay exactly <span className="text-white font-bold">₹{voucher.sellingPrice}</span>.</p>
                      <p>3. Enter the 12-digit UTR below & submit.</p>
                    </div>
                  </div>
                </div>

                {/* UTR Reference Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-white uppercase tracking-wide">
                      ENTER 12-DIGIT UPI UTR / REF NUMBER <span className="text-pink-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoFillTestUtr}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
                    >
                      Auto-Fill Sandbox UTR
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 428901847120"
                    className="w-full text-sm font-mono bg-black/50 border border-indigo-500/40 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-white placeholder:text-gray-600 focus:outline-none shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Direct IMPS Block */}
            {paymentMethod === 'gateway' && (
              <div className="rounded-xl bg-[#131526] border border-white/10 p-4 space-y-3">
                <div className="text-xs text-gray-300">
                  Direct Merchant Settlement Gateway:
                </div>
                <div className="text-xs font-mono bg-black/40 p-3 rounded-lg border border-white/10 space-y-1 text-gray-300">
                  <div>Bank: <span className="text-white font-bold">HDFC BANK LTD</span></div>
                  <div>Merchant: <span className="text-white font-bold">{settings.merchantName}</span></div>
                  <div>Account: <span className="text-white font-bold">50200088921820</span></div>
                  <div>IFSC: <span className="text-white font-bold">HDFC0001289</span></div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white uppercase mb-1">
                    IMPS / UTR REFERENCE NUMBER
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="Enter IMPS Reference / Journal ID"
                    className="w-full text-xs font-mono bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {/* Customer Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Customer Name"
                  className="w-full text-xs bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  DELIVERY EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. email@example.com"
                  className="w-full text-xs bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Order Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="submit-payment-verification-btn"
                disabled={isSubmitting}
                className="relative w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-pink-400/50 shadow-[0_0_25px_rgba(99,102,241,0.6)] chamak-btn transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer overflow-hidden"
              >
                {/* Continuous shining light beam sweep (Chamak ray) */}
                {!isSubmitting && (
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent chamak-beam pointer-events-none" />
                )}

                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>SUBMITTING ORDER FOR VERIFICATION...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300 relative z-10" />
                    <span className="relative z-10">⚡ SUBMIT PAYMENT & PLACE ORDER (₹{voucher.sellingPrice.toLocaleString('en-IN')})</span>
                    <ChevronRight className="w-4 h-4 relative z-10" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-[10px] text-gray-500 flex items-center justify-center gap-1.5">
              <span>🔒 256-Bit Encrypted Payment Flow</span>
              <span>•</span>
              <span>⚡ Status: Pending until Admin / Gateway Verification</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
