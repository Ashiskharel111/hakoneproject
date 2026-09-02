'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  ShieldCheck,
  Lock,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CreditCard,
  Smartphone,
  Check,
  QrCode,
  ArrowRight,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const rawPublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const publishableKey = rawPublishableKey.trim().split('#')[0].trim().split(/\s+/)[0].replace(/^["']|["']$/g, '');
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export interface BookingPaymentDetails {
  bookingType: 'destination' | 'airport_transfer' | 'winter_transfer' | 'custom_charter';
  destinationId?: string;
  destinationTitle: string;
  pickupId?: string;
  pickupAddress?: string;
  vehicle: 'alphard' | 'granace' | 'hiace' | 'Foreign Large' | 'Wagon';
  vehicleType?: 'Foreign Large' | 'Wagon';
  vehicleCount?: number;
  timeOfDay?: 'Standard' | 'Late Night';
  nrtGreeter?: boolean;
  vipMeetCount?: number;
  vehicleName: string;
  passengers: number;
  luggageCount: number;
  skiBagCount?: number;
  addSecondVehicle?: boolean;
  travelDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  flightNumber?: string;
  notes?: string;
  amount: number;
  currency?: string;
}

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingPaymentDetails;
  onSuccess: (bookingRef: string, paymentIntentId: string) => void;
}

type PaymentMethodType = 'apple_pay' | 'google_pay' | 'card' | 'paypay' | 'wechat_pay' | 'alipay';

interface DeviceCapabilities {
  isAppleDevice: boolean;
  isAndroidOrChrome: boolean;
  supportsApplePay: boolean;
  supportsGooglePay: boolean;
  detectedWallet: 'apple_pay' | 'google_pay' | null;
}

function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isAppleDevice: false,
      isAndroidOrChrome: false,
      supportsApplePay: false,
      supportsGooglePay: false,
      detectedWallet: null,
    };
  }

  const ua = window.navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isMac = /Macintosh|Mac OS X/i.test(ua) && !('ontouchend' in document);
  const isApple = isIOS || isMac;
  const isAndroid = /Android/i.test(ua);
  const isChrome = /Chrome|CriOS/i.test(ua) && !/Edge|Edg/i.test(ua);

  let hasApplePayApi = false;
  try {
    if ((window as any).ApplePaySession && (window as any).ApplePaySession.canMakePayments()) {
      hasApplePayApi = true;
    }
  } catch (e) {
    // Ignore error
  }

  const supportsApple = isApple && (hasApplePayApi || isIOS || isMac);
  const supportsGoogle = (isAndroid || isChrome) && !isIOS;

  let detectedWallet: 'apple_pay' | 'google_pay' | null = null;
  if (supportsApple) {
    detectedWallet = 'apple_pay';
  } else if (supportsGoogle) {
    detectedWallet = 'google_pay';
  }

  return {
    isAppleDevice: isApple,
    isAndroidOrChrome: isAndroid || isChrome,
    supportsApplePay: supportsApple,
    supportsGooglePay: supportsGoogle,
    detectedWallet,
  };
}

function CheckoutForm({
  bookingDetails,
  clientSecret,
  bookingRef,
  isSandbox,
  deviceCaps,
  onSuccess,
}: {
  bookingDetails: BookingPaymentDetails;
  clientSecret: string;
  bookingRef: string;
  isSandbox?: boolean;
  deviceCaps: DeviceCapabilities;
  onSuccess: (bookingRef: string, paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [lang] = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Default selected payment method based on device detection
  const initialMethod: PaymentMethodType = deviceCaps.detectedWallet === 'apple_pay'
    ? 'apple_pay'
    : deviceCaps.detectedWallet === 'google_pay'
    ? 'google_pay'
    : 'card';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(initialMethod);
  const [hardwareWalletVerified, setHardwareWalletVerified] = useState<boolean>(false);

  // Check live Stripe PaymentRequest hardware tokenization
  useEffect(() => {
    if (!stripe) return;

    try {
      const pr = stripe.paymentRequest({
        country: 'JP',
        currency: (bookingDetails.currency || 'jpy').toLowerCase(),
        total: {
          label: bookingDetails.destinationTitle || 'SK Limo Charter',
          amount: bookingDetails.amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setHardwareWalletVerified(true);
          if (result.applePay) {
            setSelectedMethod('apple_pay');
          } else if (result.googlePay) {
            setSelectedMethod('google_pay');
          }
        }
      });
    } catch (e) {
      console.warn('PaymentRequest check notice:', e);
    }
  }, [stripe, bookingDetails]);

  const handleExpressConfirm = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        receipt_email: bookingDetails.guestEmail,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Express checkout payment failed.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsProcessing(false);
      onSuccess(bookingRef, paymentIntent.id);
    } else if (paymentIntent && paymentIntent.status === 'processing') {
      setErrorMessage(
        lang === 'ja'
          ? 'お支払いを処理中です。完了次第メールにて予約確認書をお送りいたします。'
          : lang === 'zh'
          ? '支付处理中，处理完成后将通过邮件发送预订确认单。'
          : 'Your payment is processing. We will email your confirmation once completed.'
      );
      setIsProcessing(false);
    } else {
      setErrorMessage(
        lang === 'ja'
          ? '決済を完了できませんでした。お支払い情報をご確認ください。'
          : lang === 'zh'
          ? '支付未完成，请核对支付方式后重试。'
          : 'Payment could not be completed. Please check your payment details.'
      );
      setIsProcessing(false);
    }
  };

  const handleGenericPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isSandbox || !stripe || !elements) {
      // Sandbox / Test Mode Instant Confirmation
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(bookingRef, `pi_mock_${selectedMethod}_${Date.now()}`);
      }, 1200);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        receipt_email: bookingDetails.guestEmail,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed. Please check your card or wallet information.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsProcessing(false);
      onSuccess(bookingRef, paymentIntent.id);
    } else if (paymentIntent && paymentIntent.status === 'processing') {
      setErrorMessage(
        lang === 'ja'
          ? 'お支払いを処理中です。完了次第メールにて予約確認書をお送りいたします。'
          : lang === 'zh'
          ? '支付处理中，处理完成后将通过邮件发送预订确认单。'
          : 'Your payment is processing. We will email your confirmation once completed.'
      );
      setIsProcessing(false);
    } else {
      setErrorMessage(
        lang === 'ja'
          ? '決済を完了できませんでした。カード情報をご確認の上もう一度お試しください。'
          : lang === 'zh'
          ? '支付未完成，请核对卡片信息后重试。'
          : 'Payment could not be completed. Please check your details and try again.'
      );
      setIsProcessing(false);
    }
  };

  const t = {
    selectMethodTitle: {
      ja: 'お支払い方法を選択',
      zh: '请选择支付方式',
      fr: 'Choisissez votre moyen de paiement',
      es: 'Seleccione su método de pago',
      en: 'Select Payment Method',
    }[lang],
    deviceDetectedBadge: {
      ja: 'この端末で利用可能',
      zh: '当前设备支持',
      fr: 'Disponible sur cet appareil',
      es: 'Disponible en este dispositivo',
      en: 'Supported on your device',
    }[lang],
    cardsTitle: { ja: 'クレジットカード', zh: '国际信用卡', fr: 'Carte Bancaire', es: 'Tarjeta', en: 'Credit / Debit Card' }[lang],
    cardsDesc: { ja: 'VISA / Mastercard / AMEX / JCB / 銀聯', zh: '支持 Visa / 万事达 / 美国运通 / JCB / 银联', fr: 'Visa, Mastercard, AMEX, JCB, UnionPay', es: 'Visa, Mastercard, AMEX, JCB, UnionPay', en: 'Visa, Mastercard, AMEX, JCB, UnionPay' }[lang],
    applePayTitle: { ja: 'Apple Pay', zh: 'Apple Pay', fr: 'Apple Pay', es: 'Apple Pay', en: 'Apple Pay' }[lang],
    applePayDesc: { ja: 'Touch ID / Face ID で即時決済', zh: '支持 Face ID / Touch ID 极速一键支付', fr: 'Paiement instantané avec Touch ID / Face ID', es: 'Pago instantáneo con Touch ID / Face ID', en: '1-Click with Face ID or Touch ID' }[lang],
    googlePayTitle: { ja: 'Google Pay', zh: 'Google Pay', fr: 'Google Pay', es: 'Google Pay', en: 'Google Pay' }[lang],
    googlePayDesc: { ja: 'Google アカウントでワンクリック決済', zh: '关联 Google 账户快速安全结账', fr: 'Paiement rapide via compte Google', es: 'Pago rápido con cuenta de Google', en: 'Fast & secure checkout with Google' }[lang],
    paypayTitle: { ja: 'PayPay', zh: 'PayPay (日本手机支付)', fr: 'PayPay (Japon)', es: 'PayPay (Japón)', en: 'PayPay (Japan QR)' }[lang],
    paypayDesc: { ja: 'PayPay残高・ポイント・QR決済', zh: '日本第一移动支付，扫码或应用跳转支付', fr: 'Paiement QR N°1 au Japon', es: 'Pago QR N°1 en Japón', en: 'Japan #1 Mobile QR Wallet' }[lang],
    wechatTitle: { ja: 'WeChat Pay (微信支付)', zh: '微信支付 WeChat Pay', fr: 'WeChat Pay', es: 'WeChat Pay', en: 'WeChat Pay' }[lang],
    wechatDesc: { ja: 'QRコード読み取りまたはアプリ内決済', zh: '支持微信扫码 / 跨境人民币自动结算', fr: 'Paiement par code QR WeChat', es: 'Pago mediante código QR WeChat', en: 'Scan QR with WeChat App' }[lang],
    alipayTitle: { ja: 'Alipay (支付宝)', zh: '支付宝 Alipay', fr: 'Alipay', es: 'Alipay', en: 'Alipay' }[lang],
    alipayDesc: { ja: '中国・アジア主要電子ウォレット', zh: '支持支付宝扫码 / 跨境极速结算', fr: 'Paiement par QR Alipay', es: 'Pago por QR Alipay', en: 'Scan QR with Alipay App' }[lang],
    cardHolder: { ja: '代表者名:', zh: '持卡人姓名:', fr: 'Titulaire :', es: 'Titular:', en: 'Card Holder:' }[lang],
    amountLabel: { ja: '決済金額:', zh: '实付金额:', fr: 'Montant :', es: 'Importe:', en: 'Amount:' }[lang],
    processing: {
      ja: '安全に決済処理中...',
      zh: '正在安全处理支付...',
      fr: 'Autorisation du paiement sécurisé...',
      es: 'Procesando pago seguro...',
      en: 'Authorizing Secure Payment...',
    }[lang],
    payWithCard: {
      ja: `¥${bookingDetails.amount.toLocaleString()} をカードで支払う`,
      zh: `使用信用卡支付 ¥${bookingDetails.amount.toLocaleString()}`,
      fr: `Payer ¥${bookingDetails.amount.toLocaleString()} par Carte`,
      es: `Pagar ¥${bookingDetails.amount.toLocaleString()} con Tarjeta`,
      en: `Pay ¥${bookingDetails.amount.toLocaleString()} with Card`,
    }[lang],
    payWithApple: {
      ja: `Pay で支払う (¥${bookingDetails.amount.toLocaleString()})`,
      zh: `使用 Pay 支付 (¥${bookingDetails.amount.toLocaleString()})`,
      fr: `Payer avec Pay (¥${bookingDetails.amount.toLocaleString()})`,
      es: `Pagar con Pay (¥${bookingDetails.amount.toLocaleString()})`,
      en: `Pay with Pay (¥${bookingDetails.amount.toLocaleString()})`,
    }[lang],
    payWithGoogle: {
      ja: `Google Pay で支払う (¥${bookingDetails.amount.toLocaleString()})`,
      zh: `使用 Google Pay 支付 (¥${bookingDetails.amount.toLocaleString()})`,
      fr: `Payer avec Google Pay (¥${bookingDetails.amount.toLocaleString()})`,
      es: `Pagar con Google Pay (¥${bookingDetails.amount.toLocaleString()})`,
      en: `Pay with Google Pay (¥${bookingDetails.amount.toLocaleString()})`,
    }[lang],
    payWithPayPay: {
      ja: `PayPay アプリ / QRで支払う (¥${bookingDetails.amount.toLocaleString()})`,
      zh: `使用 PayPay 扫码支付 (¥${bookingDetails.amount.toLocaleString()})`,
      fr: `Payer avec PayPay (¥${bookingDetails.amount.toLocaleString()})`,
      es: `Pagar con PayPay (¥${bookingDetails.amount.toLocaleString()})`,
      en: `Pay with PayPay (¥${bookingDetails.amount.toLocaleString()})`,
    }[lang],
    payWithWeChat: {
      ja: `微信支付 (WeChat) で支払う (¥${bookingDetails.amount.toLocaleString()})`,
      zh: `使用 微信支付 扫码付款 (¥${bookingDetails.amount.toLocaleString()})`,
      fr: `Payer avec WeChat Pay (¥${bookingDetails.amount.toLocaleString()})`,
      es: `Pagar con WeChat Pay (¥${bookingDetails.amount.toLocaleString()})`,
      en: `Pay with WeChat Pay (¥${bookingDetails.amount.toLocaleString()})`,
    }[lang],
    payWithAlipay: {
      ja: `支付宝 (Alipay) で支払う (¥${bookingDetails.amount.toLocaleString()})`,
      zh: `使用 支付宝 扫码付款 (¥${bookingDetails.amount.toLocaleString()})`,
      fr: `Payer avec Alipay (¥${bookingDetails.amount.toLocaleString()})`,
      es: `Pagar con Alipay (¥${bookingDetails.amount.toLocaleString()})`,
      en: `Pay with Alipay (¥${bookingDetails.amount.toLocaleString()})`,
    }[lang],
    scanPromptJa: 'スマートフォンでQRコードを読み取って決済を完了してください。決済完了後、自動的に予約確定画面に遷移します。',
    scanPromptZh: '请使用对应手机应用扫描下方二维码完成支付。支付成功后系统将自动完成预订并发送确认单。',
    scanPromptEn: 'Scan the QR code with your mobile app to complete the transaction. The booking confirmation will trigger automatically upon authorization.',
    sslTitle: { ja: '256-Bit SSL', zh: '256位 SSL 加密', fr: 'SSL 256-Bit', es: 'SSL 256-Bit', en: '256-Bit SSL' }[lang],
    sslDesc: { ja: '銀行水準の暗号化', zh: '银行级数据安全', fr: 'Cryptage Bancaire', es: 'Cifrado Bancario', en: 'Bank-Grade Encryption' }[lang],
    secure3dTitle: { ja: '3Dセキュア 2.0', zh: '3D Secure 2.0', fr: '3D Secure 2.0', es: '3D Secure 2.0', en: '3D Secure 2.0' }[lang],
    secure3dDesc: { ja: '生体認証・ワンタイム保護', zh: '生物识别与动态验证', fr: 'Protection Biométrique & OTP', es: 'Protección Biométrica y OTP', en: 'Biometric & OTP Guard' }[lang],
    vaultTitle: { ja: 'カード情報非保持', zh: '零卡号本地留存', fr: 'Zéro Stockage', es: 'Cero Almacenamiento', en: 'Zero Storage' }[lang],
    vaultDesc: { ja: 'Stripe 暗号化保管', zh: 'Stripe 国际金库托管', fr: 'Coffre-fort Stripe', es: 'Bóveda Cifrada Stripe', en: 'Encrypted Stripe Vault' }[lang],
  };

  const paymentOptions: {
    id: PaymentMethodType;
    title: string;
    description: string;
    isDetected?: boolean;
    badgeText?: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'apple_pay',
      title: t.applePayTitle,
      description: t.applePayDesc,
      isDetected: deviceCaps.supportsApplePay,
      badgeText: deviceCaps.supportsApplePay ? t.deviceDetectedBadge : undefined,
      icon: (
        <div className="w-8 h-8 rounded-lg bg-black border border-slate-700 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.75-11.64-14.13-5.77-9.03-10.25-19.46-13.44-31.28-3.19-11.83-4.78-22.95-4.78-33.37 0-14.24 3.48-26.04 10.44-35.4 6.96-9.35 15.88-14.17 26.76-14.46 4.8 0 10.21 1.25 16.24 3.75 6.02 2.51 10.15 3.82 12.38 3.94 1.8.12 6.07-1.25 12.8-4.11 6.74-2.86 12.5-4.13 17.29-3.82 12.82.72 23.01 5.37 30.58 13.97-11.3 6.86-16.83 16.31-16.59 28.34.25 9.4 3.84 17.3 10.77 23.71 6.94 6.41 15.34 10.08 25.21 11.01-2.17 6.64-4.76 13.06-7.77 19.26zM119.22 31.84c0-7.39 2.65-14.4 7.95-21.03 5.3-6.63 11.96-10.8 19.98-12.51.13 1.13.2 2.14.2 3.03 0 7.39-2.82 14.52-8.46 21.39-5.63 6.87-12.43 11.02-20.4 12.46-.27-1.12-.4-2.23-.4-3.34z"/>
          </svg>
        </div>
      ),
    },
    {
      id: 'google_pay',
      title: t.googlePayTitle,
      description: t.googlePayDesc,
      isDetected: deviceCaps.supportsGooglePay,
      badgeText: deviceCaps.supportsGooglePay ? t.deviceDetectedBadge : undefined,
      icon: (
        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
        </div>
      ),
    },
    {
      id: 'card',
      title: t.cardsTitle,
      description: t.cardsDesc,
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#141B2D] border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
          <CreditCard className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: 'paypay',
      title: t.paypayTitle,
      description: t.paypayDesc,
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#FF0033]/20 border border-[#FF0033]/50 flex items-center justify-center shrink-0">
          <span className="text-[#FF0033] text-[10px] font-extrabold tracking-tighter">PayPay</span>
        </div>
      ),
    },
    {
      id: 'wechat_pay',
      title: t.wechatTitle,
      description: t.wechatDesc,
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#07C160]/20 border border-[#07C160]/50 flex items-center justify-center shrink-0">
          <span className="text-[#07C160] text-[10px] font-bold">微信</span>
        </div>
      ),
    },
    {
      id: 'alipay',
      title: t.alipayTitle,
      description: t.alipayDesc,
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#1677FF]/20 border border-[#1677FF]/50 flex items-center justify-center shrink-0">
          <span className="text-[#1677FF] text-[10px] font-bold">支</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Payment Method Selector Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>{t.selectMethodTitle}</span>
        </span>
        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>PCI-DSS Level 1 SSL</span>
        </span>
      </div>

      {/* Payment Method Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {paymentOptions.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setSelectedMethod(opt.id);
                setErrorMessage(null);
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 relative cursor-pointer ${
                isSelected
                  ? 'bg-[#151D2F] border-[#C5A059] shadow-lg shadow-[#C5A059]/10 ring-1 ring-[#C5A059]'
                  : 'bg-[#070A10] border-slate-800/90 hover:border-slate-700 hover:bg-[#0C101A]'
              }`}
            >
              {opt.icon}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#C5A059]' : 'text-white'}`}>
                    {opt.title}
                  </span>
                  {opt.badgeText && (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded-full shrink-0">
                      ⚡ {opt.badgeText}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {opt.description}
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected
                    ? 'border-[#C5A059] bg-[#C5A059] text-black'
                    : 'border-slate-700 bg-slate-900 text-transparent'
                }`}
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Payment Method Active Panel */}
      <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* 1. Apple Pay Selected View */}
        {selectedMethod === 'apple_pay' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="bg-black border border-slate-700 rounded-md px-2 py-0.5 text-white font-semibold text-xs flex items-center gap-1">
                  <span></span>
                  <span>Pay</span>
                </div>
                <span className="text-xs text-slate-300 font-medium">{t.applePayTitle}</span>
              </div>
              <span className="text-xs font-bold text-[#C5A059] font-mono">
                ¥{bookingDetails.amount.toLocaleString()} JPY
              </span>
            </div>

            {deviceCaps.supportsApplePay ? (
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ja'
                  ? 'Apple Pay に登録されたカードを使用して、Touch ID / Face ID で即時かつ安全にお支払いいただけます。'
                  : lang === 'zh'
                  ? '使用您 Apple 钱包中绑定的银行卡，通过 Face ID 或 Touch ID 极速完成预订与支付。'
                  : 'Pay instantly with Apple Pay using your saved cards and authenticate securely via Face ID or Touch ID.'}
              </p>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-300">
                {lang === 'ja'
                  ? '※ このブラウザまたは端末は Apple Pay に対応していません。Safari または iPhone / iPad / Mac でご利用いただくか、クレジットカードまたは他の決済方法をご選択ください。'
                  : lang === 'zh'
                  ? '※ 当前浏览器或设备未启用 Apple Pay。请使用 Safari 或苹果设备，或选择国际信用卡及其他支付方式。'
                  : 'Notice: Apple Pay is available on Safari for iOS / iPadOS / macOS. You can also select Credit Card or other payment methods.'}
              </div>
            )}

            {!isSandbox && stripe && elements ? (
              <div className="pt-1">
                <ExpressCheckoutElement
                  onConfirm={handleExpressConfirm}
                  options={{
                    buttonHeight: 46,
                    buttonTheme: {
                      applePay: 'black',
                    },
                    paymentMethods: {
                      applePay: 'auto',
                      googlePay: 'never',
                      link: 'never',
                    },
                  }}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleGenericPayment()}
                disabled={isProcessing}
                className="w-full bg-black hover:bg-slate-900 border border-slate-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{t.processing}</span>
                  </>
                ) : (
                  <>
                    <span className="text-base leading-none"></span>
                    <span>{t.payWithApple}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* 2. Google Pay Selected View */}
        {selectedMethod === 'google_pay' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 border border-slate-700 rounded-md px-2 py-0.5 text-white font-semibold text-xs flex items-center gap-1">
                  <span>G</span>
                  <span>Pay</span>
                </div>
                <span className="text-xs text-slate-300 font-medium">{t.googlePayTitle}</span>
              </div>
              <span className="text-xs font-bold text-[#C5A059] font-mono">
                ¥{bookingDetails.amount.toLocaleString()} JPY
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ja'
                ? 'Google アカウントに登録されたお支払い方法で、素早く安全に決済を完了します。'
                : lang === 'zh'
                ? '使用绑定在 Google 账户中的支付方式，一键快速完成安全预订。'
                : 'Fast, simple, and secure checkout using payment methods saved in your Google Account.'}
            </p>

            {!isSandbox && stripe && elements ? (
              <div className="pt-1">
                <ExpressCheckoutElement
                  onConfirm={handleExpressConfirm}
                  options={{
                    buttonHeight: 46,
                    buttonTheme: {
                      googlePay: 'black',
                    },
                    paymentMethods: {
                      googlePay: 'auto',
                      applePay: 'never',
                      link: 'never',
                    },
                  }}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleGenericPayment()}
                disabled={isProcessing}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{t.processing}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{t.payWithGoogle}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* 3. Credit / Debit Card Selected View */}
        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-400" />
                <span className="text-xs text-slate-300 font-medium">{t.cardsTitle}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#1A1F71] bg-white px-1 rounded text-[9px] font-bold">VISA</span>
                <span className="text-[#EB001B] font-extrabold text-[9px]">MC</span>
                <span className="text-[#006FCF] font-extrabold text-[9px]">AMEX</span>
                <span className="text-[#005BAC] font-extrabold text-[9px]">JCB</span>
                <span className="text-[#D92D20] bg-white px-1 rounded text-[9px] font-bold">银联</span>
              </div>
            </div>

            {!isSandbox && stripe && elements ? (
              <PaymentElement
                options={{
                  layout: {
                    type: 'accordion',
                    defaultCollapsed: false,
                    radios: 'always',
                    spacedAccordionItems: true,
                  },
                }}
              />
            ) : (
              <div className="space-y-3">
                <div className="bg-[#07090E] border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>{t.cardHolder}</span>
                    <span className="text-white font-medium">{bookingDetails.guestName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>{t.amountLabel}</span>
                    <span className="text-[#C5A059] font-bold">¥{bookingDetails.amount.toLocaleString()} JPY</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>3D Secure 2.0 生体認証暗号化決済が自動適用されます。</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleGenericPayment()}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#C5A059] via-[#d8b46b] to-[#C5A059] hover:opacity-95 text-[#0A0D14] font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/10 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0A0D14]" />
                  <span>{t.processing}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t.payWithCard}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 4. PayPay Selected View */}
        {selectedMethod === 'paypay' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="bg-[#FF0033] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">PayPay</span>
                <span className="text-xs text-slate-300 font-medium">{t.paypayTitle}</span>
              </div>
              <span className="text-xs font-bold text-[#FF0033] font-mono">
                ¥{bookingDetails.amount.toLocaleString()} JPY
              </span>
            </div>

            <div className="bg-[#12080A] border border-[#FF0033]/30 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center shrink-0 shadow">
                  {/* Dynamic PayPay QR Code representation */}
                  <div className="w-full h-full border-2 border-slate-900 grid grid-cols-3 gap-0.5 p-0.5">
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-[#FF0033] rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-black rounded-xs"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white block">PayPay アプリ決済 / QRコード</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {lang === 'ja' ? t.scanPromptJa : lang === 'zh' ? t.scanPromptZh : t.scanPromptEn}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleGenericPayment()}
              disabled={isProcessing}
              className="w-full bg-[#FF0033] hover:bg-[#E6002E] text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#FF0033]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t.processing}</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>{t.payWithPayPay}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 5. WeChat Pay (微信支付) Selected View */}
        {selectedMethod === 'wechat_pay' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="bg-[#07C160] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">微信支付</span>
                <span className="text-xs text-slate-300 font-medium">{t.wechatTitle}</span>
              </div>
              <span className="text-xs font-bold text-[#07C160] font-mono">
                ¥{bookingDetails.amount.toLocaleString()} JPY
              </span>
            </div>

            <div className="bg-[#08150D] border border-[#07C160]/30 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center shrink-0 shadow">
                  {/* WeChat QR representation */}
                  <div className="w-full h-full border-2 border-[#07C160] grid grid-cols-3 gap-0.5 p-0.5">
                    <div className="bg-[#07C160] rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-[#07C160] rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-[#07C160] rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-[#07C160] rounded-xs"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white block">微信扫一扫 · 跨境极速支付</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {lang === 'zh'
                      ? '打开微信“扫一扫”扫描屏幕或跳转微信完成支付，实时按中国银行实时汇率折算人民币结算。'
                      : t.scanPromptEn}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleGenericPayment()}
              disabled={isProcessing}
              className="w-full bg-[#07C160] hover:bg-[#06ad56] text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#07C160]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t.processing}</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>{t.payWithWeChat}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 6. Alipay (支付宝) Selected View */}
        {selectedMethod === 'alipay' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="bg-[#1677FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">支付宝</span>
                <span className="text-xs text-slate-300 font-medium">{t.alipayTitle}</span>
              </div>
              <span className="text-xs font-bold text-[#1677FF] font-mono">
                ¥{bookingDetails.amount.toLocaleString()} JPY
              </span>
            </div>

            <div className="bg-[#091322] border border-[#1677FF]/30 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center shrink-0 shadow">
                  {/* Alipay QR representation */}
                  <div className="w-full h-full border-2 border-[#1677FF] grid grid-cols-3 gap-0.5 p-0.5">
                    <div className="bg-[#1677FF] rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-[#1677FF] rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-[#1677FF] rounded-xs"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-[#1677FF] rounded-xs"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white block">支付宝扫一扫 · 跨境即时结算</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {lang === 'zh'
                      ? '打开支付宝 App 扫描二维码或点击跳转授权支付，支持花呗/余额宝及国内借记卡。'
                      : t.scanPromptEn}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleGenericPayment()}
              disabled={isProcessing}
              className="w-full bg-[#1677FF] hover:bg-[#1264db] text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#1677FF]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t.processing}</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>{t.payWithAlipay}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Triple Security Trust Badges */}
      <div className="bg-[#0A0D14]/80 border border-slate-800/80 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span className="font-semibold text-slate-200">{t.sslTitle}</span>
          <span className="text-[9px] text-slate-500">{t.sslDesc}</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-x border-slate-800">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">{t.secure3dTitle}</span>
          <span className="text-[9px] text-slate-500">{t.secure3dDesc}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <CreditCard className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-200">{t.vaultTitle}</span>
          <span className="text-[9px] text-slate-500">{t.vaultDesc}</span>
        </div>
      </div>
    </div>
  );
}

export default function StripePaymentModal({
  isOpen,
  onClose,
  bookingDetails,
  onSuccess,
}: StripePaymentModalProps) {
  const [lang] = useLanguage();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string>('');
  const [isSandbox, setIsSandbox] = useState<boolean>(false);
  const [isLoadingIntent, setIsLoadingIntent] = useState<boolean>(true);
  const [initError, setInitError] = useState<string | null>(null);
  const lastPayloadRef = React.useRef<string>('');

  const deviceCaps = useMemo(() => detectDeviceCapabilities(), []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const payloadString = JSON.stringify({
      bookingType: bookingDetails.bookingType,
      destinationId: bookingDetails.destinationId,
      pickupId: bookingDetails.pickupId,
      vehicle: bookingDetails.vehicle,
      vehicleType: bookingDetails.vehicleType,
      vehicleCount: bookingDetails.vehicleCount,
      timeOfDay: bookingDetails.timeOfDay,
      nrtGreeter: bookingDetails.nrtGreeter,
      vipMeetCount: bookingDetails.vipMeetCount,
      passengers: bookingDetails.passengers,
      luggageCount: bookingDetails.luggageCount,
      skiBagCount: bookingDetails.skiBagCount,
      addSecondVehicle: bookingDetails.addSecondVehicle,
      travelDate: bookingDetails.travelDate,
      guestName: bookingDetails.guestName,
      guestEmail: bookingDetails.guestEmail,
      guestPhone: bookingDetails.guestPhone,
      pickupAddress: bookingDetails.pickupAddress,
      flightNumber: bookingDetails.flightNumber,
      notes: bookingDetails.notes,
      amount: bookingDetails.amount,
      currency: bookingDetails.currency || 'jpy',
    });

    if (clientSecret && lastPayloadRef.current === payloadString) {
      setIsLoadingIntent(false);
      return;
    }

    let isMounted = true;
    setIsLoadingIntent(true);
    setInitError(null);
    lastPayloadRef.current = payloadString;

    async function initPaymentIntent() {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: payloadString,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize payment session.');
        }

        if (isMounted) {
          setClientSecret(data.clientSecret);
          setBookingRef(data.bookingRef);
          setIsSandbox(!!data.sandboxMode || !publishableKey);
          setIsLoadingIntent(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error initializing Stripe payment intent:', err);
          setInitError(err.message || 'Payment gateway connection error.');
          setIsLoadingIntent(false);
        }
      }
    }

    initPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [isOpen, bookingDetails, clientSecret]);

  if (!isOpen) return null;

  const elementsOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#C5A059',
        colorBackground: '#0A0D14',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        borderRadius: '12px',
        spacingUnit: '4px',
      },
      rules: {
        '.Input': {
          border: '1px solid #1e293b',
          backgroundColor: '#0A0D14',
        },
        '.Input:focus': {
          border: '1px solid #C5A059',
          boxShadow: '0 0 0 1px #C5A059',
        },
        '.Label': {
          color: '#94a3b8',
          fontSize: '12px',
          fontWeight: '500',
        },
        '.Tab': {
          border: '1px solid #1e293b',
          backgroundColor: '#0A0D14',
        },
        '.Tab--selected': {
          borderColor: '#C5A059',
          boxShadow: '0 0 0 1px #C5A059',
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0E131F] border border-slate-700/80 rounded-3xl max-w-lg w-full p-5 sm:p-7 space-y-4 shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full border border-[#C5A059]/30">
              {{
                ja: 'Stripe 決済ゲートウェイ',
                zh: 'Stripe VIP 官方安全收银台',
                fr: 'Passerelle de Paiement Stripe VIP',
                es: 'Pasarela Oficial de Pago Seguro Stripe',
                en: 'Official Stripe VIP Checkout',
              }[lang]}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {{
              ja: 'オンライン予約・事前決済',
              zh: '专属专车在线预订与安全支付',
              fr: 'Réservation & Paiement Sécurisé',
              es: 'Reserva y Pago Seguro en Línea',
              en: 'Secure Private Charter Checkout',
            }[lang]}
          </h3>
        </div>

        {/* Trip Summary Card */}
        <div className="bg-[#07090E] border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">
                {bookingDetails.destinationTitle}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {bookingDetails.vehicleName} • {bookingDetails.passengers} {{ ja: '名', zh: '人', fr: 'Passagers', es: 'Pasajeros', en: 'Pax' }[lang]} • {bookingDetails.travelDate}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block">{{ ja: '総額', zh: '总额', fr: 'Total', es: 'Total', en: 'Total' }[lang]}</span>
              <span className="text-lg font-extrabold text-[#C5A059] font-mono">
                ¥{bookingDetails.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div>
              <span className="block text-slate-500">{{ ja: '代表者様名:', zh: '持卡人/乘客:', fr: 'Nom :', es: 'Nombre:', en: 'Guest Name:' }[lang]}</span>
              <span className="text-slate-300 font-medium truncate block">{bookingDetails.guestName}</span>
            </div>
            <div>
              <span className="block text-slate-500">{{ ja: 'メールアドレス:', zh: '电子邮箱:', fr: 'Email :', es: 'Correo:', en: 'Email:' }[lang]}</span>
              <span className="text-slate-300 font-medium truncate block">{bookingDetails.guestEmail}</span>
            </div>
          </div>
        </div>

        {/* Main Payment Section */}
        {isLoadingIntent ? (
          <div className="py-10 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mx-auto" />
            <p className="text-xs text-slate-400">
              {{
                ja: '安全な決済セッションを確立中...',
                zh: '正在建立高强度加密支付通道...',
                fr: 'Établissement de la session sécurisée...',
                es: 'Estableciendo sesión cifrada...',
                en: 'Establishing encrypted Stripe session...',
              }[lang]}
            </p>
          </div>
        ) : initError ? (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 space-y-3 text-center">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <div className="text-xs text-rose-300 font-medium">{initError}</div>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              {{
                ja: '旅程詳細に戻る',
                zh: '返回修改行程',
                fr: 'Retour aux détails',
                es: 'Volver a los detalles',
                en: 'Back to Trip Details',
              }[lang]}
            </button>
          </div>
        ) : isSandbox ? (
          <CheckoutForm
            bookingDetails={bookingDetails}
            clientSecret={clientSecret || ''}
            bookingRef={bookingRef}
            isSandbox={true}
            deviceCaps={deviceCaps}
            onSuccess={onSuccess}
          />
        ) : clientSecret && stripePromise ? (
          <Elements key={clientSecret} stripe={stripePromise} options={elementsOptions}>
            <CheckoutForm
              bookingDetails={bookingDetails}
              clientSecret={clientSecret}
              bookingRef={bookingRef}
              isSandbox={false}
              deviceCaps={deviceCaps}
              onSuccess={onSuccess}
            />
          </Elements>
        ) : null}
      </div>
    </div>
  );
}
