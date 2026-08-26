'use client';

import React from 'react';
import { CheckCircle2, Calendar, MapPin, Car, Users, MessageSquare, Download, Share2, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { BookingPaymentDetails } from './StripePaymentModal';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef: string;
  paymentIntentId: string;
  bookingDetails: BookingPaymentDetails;
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  bookingRef,
  paymentIntentId,
  bookingDetails,
}: BookingConfirmationModalProps) {
  const [lang] = useLanguage();

  if (!isOpen) return null;

  const t = {
    badge: {
      ja: '決済完了・予約確定',
      zh: '支付成功・预约已确认',
      fr: 'Paiement Confirmé & Vérifié',
      es: 'Pago Confirmado y Verificado',
      en: 'Payment Confirmed & Verified',
    }[lang],
    title: {
      ja: 'ご予約ありがとうございます',
      zh: '感谢您的预订',
      fr: 'Confirmation de Réservation',
      es: 'Confirmación de Reserva',
      en: 'Booking Confirmation',
    }[lang],
    emailSent: {
      ja: `${bookingDetails.guestEmail} 宛に予約確認書と領収証を送信いたしました。`,
      zh: `预约确认单与收据已发送至 ${bookingDetails.guestEmail}。`,
      fr: `Le bon de confirmation et le reçu ont été envoyés à ${bookingDetails.guestEmail}.`,
      es: `El comprobante y recibo han sido enviados a ${bookingDetails.guestEmail}.`,
      en: `Confirmation voucher and receipt have been dispatched to ${bookingDetails.guestEmail}.`,
    }[lang],
    bookingCode: { ja: '予約番号', zh: '预订编号', fr: 'CODE DE RÉSERVATION', es: 'CÓDIGO DE RESERVA', en: 'BOOKING CODE' }[lang],
    status: { ja: 'ステータス', zh: '订单状态', fr: 'STATUT', es: 'ESTADO', en: 'STATUS' }[lang],
    statusPaid: { ja: '決済済 / 運行確定', zh: '已支付 / 席位保障', fr: 'PAYÉ / GARANTI', es: 'PAGADO / GARANTIZADO', en: 'PAID / GUARANTEED' }[lang],
    service: { ja: 'サービス内容:', zh: '服务项目:', fr: 'Prestation :', es: 'Servicio:', en: 'Service:' }[lang],
    vehicle: { ja: '運行車両:', zh: '服务车型:', fr: 'Véhicule :', es: 'Vehículo:', en: 'Vehicle:' }[lang],
    travelDate: { ja: '利用日程:', zh: '出行日期:', fr: 'Date du trajet :', es: 'Fecha de viaje:', en: 'Travel Date:' }[lang],
    partySize: { ja: '乗車人数:', zh: '出行人数:', fr: 'Nombre de passagers :', es: 'Pasajeros:', en: 'Party Size:' }[lang],
    guests: { ja: '名様', zh: '位贵宾', fr: 'Passagers', es: 'Pasajeros', en: 'Guests' }[lang],
    leadPassenger: { ja: '代表者様名:', zh: '代表乘客:', fr: 'Passager principal :', es: 'Pasajero principal:', en: 'Lead Passenger:' }[lang],
    totalPaid: { ja: '決済総額:', zh: '实付总额:', fr: 'Montant Total Payé :', es: 'Monto Total Pagado:', en: 'Total Amount Paid:' }[lang],
    dispatchNote: {
      ja: '運行前日までに専任ドライバーの氏名・直通電話番号・車両ナンバーをご案内いたします。24時間体制で運行管理を行っております。',
      zh: '出行前一天，我们将向您发送专属司机的姓名、直拨电话及车牌号码。全天候24小时保障顺畅接送。',
      fr: 'Les coordonnées du chauffeur, son numéro direct et la plaque d\'immatriculation vous seront envoyés 24h avant le trajet.',
      es: 'Los datos del chófer, teléfono directo y matrícula se enviarán 24 horas antes del servicio.',
      en: 'Chauffeur details, vehicle plate number, and driver direct contact will be dispatched 24 hours prior to service.',
    }[lang],
    whatsAppBtn: {
      ja: 'WhatsApp 24時間コンシェルジュに接続',
      zh: '通过 WhatsApp 联系24小时专属管家',
      fr: 'Contacter la Conciergerie WhatsApp 24/7',
      es: 'Contactar Conserjería WhatsApp 24/7',
      en: 'Connect with WhatsApp 24/7 Concierge',
    }[lang],
    returnBtn: {
      ja: 'Webサイトに戻る',
      zh: '返回网站首页',
      fr: 'Retour au Site',
      es: 'Volver al Sitio Web',
      en: 'Return to Website',
    }[lang],
  };

  const whatsAppAiText = encodeURIComponent(
    `✨ *SK LIMO CONFIRMED RESERVATION*\n\n` +
    `• Booking Ref: ${bookingRef}\n` +
    `• Guest: ${bookingDetails.guestName}\n` +
    `• Service: ${bookingDetails.destinationTitle}\n` +
    `• Vehicle: ${bookingDetails.vehicleName}\n` +
    `• Date: ${bookingDetails.travelDate}\n` +
    `• Passengers: ${bookingDetails.passengers} Pax\n` +
    `• Payment: ¥${bookingDetails.amount.toLocaleString()} JPY (PAID VIA STRIPE)\n\n` +
    `Please confirm driver assignment and chauffeur details.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0D121F] border border-[#C5A059]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Success Badge */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#25D366]/10 border border-[#25D366]/40 flex items-center justify-center mx-auto text-[#25D366]">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#25D366] block">
            {t.badge}
          </span>
          <h3 className="text-2xl font-extrabold text-white">
            {t.title}
          </h3>
          <p className="text-xs text-slate-300">
            {t.emailSent}
          </p>
        </div>

        {/* Official Voucher Card */}
        <div className="bg-[#070A10] border border-slate-800 rounded-2xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">{t.bookingCode}</span>
              <span className="text-[#C5A059] font-bold text-sm">{bookingRef}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">{t.status}</span>
              <span className="text-[#25D366] font-bold text-xs uppercase">{t.statusPaid}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.service}</span>
              <span className="text-white font-medium text-right">{bookingDetails.destinationTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.vehicle}</span>
              <span className="text-white font-medium">{bookingDetails.vehicleName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.travelDate}</span>
              <span className="text-white font-medium">{bookingDetails.travelDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.partySize}</span>
              <span className="text-white font-medium">{bookingDetails.passengers} {t.guests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.leadPassenger}</span>
              <span className="text-white font-medium">{bookingDetails.guestName}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-slate-400 text-xs">{t.totalPaid}</span>
            <span className="text-lg font-bold text-[#C5A059]">¥{bookingDetails.amount.toLocaleString()} JPY</span>
          </div>
        </div>

        {/* Chauffeur Dispatch Info */}
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {t.dispatchNote}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={`https://wa.me/818012345678?text=${whatsAppAiText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
            <span>{t.whatsAppBtn}</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors"
          >
            {t.returnBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
