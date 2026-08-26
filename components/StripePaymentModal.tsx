'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck, Lock, X, Loader2, CheckCircle2, AlertCircle, Sparkles, CreditCard, Smartphone, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export interface BookingPaymentDetails {
  bookingType: 'destination' | 'airport_transfer' | 'winter_transfer' | 'custom_charter';
  destinationId?: string;
  destinationTitle: string;
  pickupId?: string;
  pickupAddress?: string;
  vehicle: 'alphard' | 'granace' | 'hiace';
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

function CheckoutForm({
  bookingDetails,
  clientSecret,
  bookingRef,
  isSandbox,
  onSuccess,
}: {
  bookingDetails: BookingPaymentDetails;
  clientSecret: string;
  bookingRef: string;
  isSandbox?: boolean;
  onSuccess: (bookingRef: string, paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [lang] = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    } else {
      setIsProcessing(false);
      onSuccess(bookingRef, paymentIntent?.id || bookingRef);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSandbox || !stripe || !elements) {
      // Sandbox / Test Mode Instant Confirmation
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(bookingRef, `pi_mock_${Date.now()}`);
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
    } else {
      setIsProcessing(false);
      onSuccess(bookingRef, paymentIntent?.id || bookingRef);
    }
  };

  const t = {
    acceptedMethods: {
      ja: '対応決済方法 (即時・安全)',
      zh: '支持的安全即时支付方式',
      fr: 'Moyens de Paiement Acceptés',
      es: 'Métodos de Pago Aceptados',
      en: 'Accepted Payment Methods',
    }[lang],
    sandboxTitle: {
      ja: 'Stripe サンドボックス・デモ決済',
      zh: 'Stripe 演示安全测试环境',
      fr: 'Mode Sandbox Sécurisé Stripe',
      es: 'Modo Sandbox Seguro Stripe',
      en: 'Stripe Secure Sandbox Mode',
    }[lang],
    sandboxDesc: {
      ja: '本番環境と同等の暗号化決済シミュレーションです。Apple Pay、Google Pay、WeChat Pay、Alipay、PayPay、クレジットカード決済を安全にお試しいただけます。',
      zh: '当前为安全的支付模拟环境。支持 Apple Pay、Google Pay、微信支付、支付宝、PayPay 以及国际主流信用卡的安全预订测试。',
      fr: 'Environnement de test sécurisé Stripe. Simulation instantanée pour Apple Pay, Google Pay, WeChat Pay, Alipay, PayPay et cartes bancaires.',
      es: 'Entorno de prueba seguro Stripe. Simulación para Apple Pay, Google Pay, WeChat Pay, Alipay, PayPay y tarjetas bancarias.',
      en: 'Stripe test environment active. Live Apple Pay, Google Pay, WeChat Pay, Alipay, PayPay, and Credit Cards will seamlessly process.',
    }[lang],
    cardHolder: { ja: '代表者名:', zh: '持卡人姓名:', fr: 'Titulaire :', es: 'Titular:', en: 'Card Holder:' }[lang],
    paymentMethodsLabel: { ja: '対応方法:', zh: '支付渠道:', fr: 'Moyens :', es: 'Métodos:', en: 'Payment Methods:' }[lang],
    amountLabel: { ja: '決済金額:', zh: '实付金额:', fr: 'Montant :', es: 'Importe:', en: 'Amount:' }[lang],
    paymentOptions: { ja: 'その他の決済方法', zh: '其他支付方式', fr: 'Options de Paiement', es: 'Opciones de Pago', en: 'Payment Options' }[lang],
    processing: {
      ja: '安全に決済処理中...',
      zh: '正在安全处理支付...',
      fr: 'Autorisation du paiement sécurisé...',
      es: 'Procesando pago seguro...',
      en: 'Authorizing Secure Payment...',
    }[lang],
    payButton: {
      ja: `¥${bookingDetails.amount.toLocaleString()} を支払って予約確定`,
      zh: `支付 ¥${bookingDetails.amount.toLocaleString()} 并锁定预约`,
      fr: `Autoriser & Payer ¥${bookingDetails.amount.toLocaleString()}`,
      es: `Autorizar y Pagar ¥${bookingDetails.amount.toLocaleString()}`,
      en: `Authorize & Pay ¥${bookingDetails.amount.toLocaleString()}`,
    }[lang],
    sslTitle: { ja: '256-Bit SSL', zh: '256位 SSL 加密', fr: 'SSL 256-Bit', es: 'SSL 256-Bit', en: '256-Bit SSL' }[lang],
    sslDesc: { ja: '銀行水準の暗号化', zh: '银行级数据安全', fr: 'Cryptage Bancaire', es: 'Cifrado Bancario', en: 'Bank-Grade Encryption' }[lang],
    secure3dTitle: { ja: '3Dセキュア 2.0', zh: '3D Secure 2.0', fr: '3D Secure 2.0', es: '3D Secure 2.0', en: '3D Secure 2.0' }[lang],
    secure3dDesc: { ja: '生体認証・ワンタイム保護', zh: '生物识别与动态验证', fr: 'Protection Biométrique & OTP', es: 'Protección Biométrica y OTP', en: 'Biometric & OTP Guard' }[lang],
    vaultTitle: { ja: 'カード情報非保持', zh: '零卡号本地留存', fr: 'Zéro Stockage', es: 'Cero Almacenamiento', en: 'Zero Storage' }[lang],
    vaultDesc: { ja: 'Stripe 暗号化保管', zh: 'Stripe 国际金库托管', fr: 'Coffre-fort Stripe', es: 'Bóveda Cifrada Stripe', en: 'Encrypted Stripe Vault' }[lang],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Supported Payment Methods Ribbon */}
      <div className="bg-[#070A10] border border-slate-800/90 rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {t.acceptedMethods}
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>PCI-DSS Level 1</span>
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5 pt-1">
          {/* Apple Pay */}
          <div className="bg-black border border-slate-700/80 rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <svg className="w-3 h-3 fill-white" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.75-11.64-14.13-5.77-9.03-10.25-19.46-13.44-31.28-3.19-11.83-4.78-22.95-4.78-33.37 0-14.24 3.48-26.04 10.44-35.4 6.96-9.35 15.88-14.17 26.76-14.46 4.8 0 10.21 1.25 16.24 3.75 6.02 2.51 10.15 3.82 12.38 3.94 1.8.12 6.07-1.25 12.8-4.11 6.74-2.86 12.5-4.13 17.29-3.82 12.82.72 23.01 5.37 30.58 13.97-11.3 6.86-16.83 16.31-16.59 28.34.25 9.4 3.84 17.3 10.77 23.71 6.94 6.41 15.34 10.08 25.21 11.01-2.17 6.64-4.76 13.06-7.77 19.26zM119.22 31.84c0-7.39 2.65-14.4 7.95-21.03 5.3-6.63 11.96-10.8 19.98-12.51.13 1.13.2 2.14.2 3.03 0 7.39-2.82 14.52-8.46 21.39-5.63 6.87-12.43 11.02-20.4 12.46-.27-1.12-.4-2.23-.4-3.34z"/>
            </svg>
            <span className="text-white text-[11px] font-semibold tracking-tight">Pay</span>
          </div>

          {/* Google Pay */}
          <div className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="text-white text-[11px] font-semibold tracking-tight">Pay</span>
          </div>

          {/* WeChat Pay */}
          <div className="bg-[#07C160]/15 border border-[#07C160]/40 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-[#07C160] text-[11px] font-bold">微信支付</span>
          </div>

          {/* Alipay */}
          <div className="bg-[#1677FF]/15 border border-[#1677FF]/40 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-[#1677FF] text-[11px] font-bold">支付宝</span>
          </div>

          {/* PayPay */}
          <div className="bg-[#FF0033]/15 border border-[#FF0033]/40 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-[#FF0033] text-[11px] font-bold">PayPay</span>
          </div>

          {/* Major Cards */}
          <div className="flex items-center gap-1 bg-[#0E131F] border border-slate-800 rounded-lg px-2 py-1 text-[10px] font-bold">
            <span className="text-[#1A1F71] bg-white px-1 rounded text-[9px]">VISA</span>
            <span className="text-[#EB001B] font-extrabold text-[9px]">MC</span>
            <span className="text-[#006FCF] font-extrabold text-[9px]">AMEX</span>
            <span className="text-[#005BAC] font-extrabold text-[9px]">JCB</span>
            <span className="text-[#D92D20] bg-white px-1 rounded text-[9px]">银联</span>
          </div>
        </div>
      </div>

      {isSandbox ? (
        <div className="bg-[#131926] border border-[#C5A059]/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{t.sandboxTitle}</span>
          </div>
          <p className="text-xs text-slate-300">
            {t.sandboxDesc}
          </p>
          <div className="bg-[#0A0D14] rounded-xl p-3 text-[11px] text-slate-400 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>{t.cardHolder}</span>
              <span className="text-white font-bold">{bookingDetails.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.paymentMethodsLabel}</span>
              <span className="text-emerald-400 font-bold">Cards / Apple Pay / WeChat / Alipay / PayPay (TEST)</span>
            </div>
            <div className="flex justify-between">
              <span>{t.amountLabel}</span>
              <span className="text-[#C5A059] font-bold">¥{bookingDetails.amount.toLocaleString()} JPY</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-4 space-y-4">
          {/* 1-Click Express Checkout Buttons (Apple Pay & Google Pay) */}
          <div className="space-y-2">
            <ExpressCheckoutElement
              onConfirm={handleExpressConfirm}
              options={{
                buttonHeight: 46,
                buttonTheme: {
                  applePay: 'black',
                  googlePay: 'black',
                },
                paymentMethods: {
                  applePay: 'auto',
                  googlePay: 'auto',
                  link: 'auto',
                },
              }}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800/80" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-[#0A0D14] px-2 text-slate-400">{t.paymentOptions}</span>
            </div>
          </div>

          {/* Full Payment Element: Credit Cards, Alipay, WeChat Pay, PayPay */}
          <PaymentElement
            options={{
              layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: 'always',
                spacedAccordionItems: true,
              },
              wallets: {
                applePay: 'auto',
                googlePay: 'auto',
              },
            }}
          />
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-3 pt-1">
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-[#C5A059] via-[#d8b46b] to-[#C5A059] hover:opacity-95 text-[#0A0D14] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0A0D14]" />
              <span>{t.processing}</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>{t.payButton}</span>
            </>
          )}
        </button>

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
    </form>
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

  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setInitError(null);
      return;
    }

    let isMounted = true;
    setIsLoadingIntent(true);
    setInitError(null);

    async function initPaymentIntent() {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingType: bookingDetails.bookingType,
            destinationId: bookingDetails.destinationId,
            pickupId: bookingDetails.pickupId,
            vehicle: bookingDetails.vehicle,
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
          }),
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
  }, [isOpen, bookingDetails]);

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
      <div className="bg-[#0E131F] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
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
          <div className="py-12 text-center space-y-3">
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
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
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
            onSuccess={onSuccess}
          />
        ) : clientSecret && stripePromise ? (
          <Elements key={clientSecret} stripe={stripePromise} options={elementsOptions}>
            <CheckoutForm
              bookingDetails={bookingDetails}
              clientSecret={clientSecret}
              bookingRef={bookingRef}
              isSandbox={false}
              onSuccess={onSuccess}
            />
          </Elements>
        ) : null}
      </div>
    </div>
  );
}
