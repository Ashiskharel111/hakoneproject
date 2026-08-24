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
            {lang === 'ja' ? '決済完了・予約確定' : 'Payment Confirmed & Verified'}
          </span>
          <h3 className="text-2xl font-extrabold text-white">
            {lang === 'ja' ? 'ご予約ありがとうございます' : 'Booking Confirmation'}
          </h3>
          <p className="text-xs text-slate-300">
            {lang === 'ja'
              ? `${bookingDetails.guestEmail} 宛に予約確認書と領収証を送信いたしました。`
              : `Confirmation voucher and receipt have been dispatched to ${bookingDetails.guestEmail}.`}
          </p>
        </div>

        {/* Official Voucher Card */}
        <div className="bg-[#070A10] border border-slate-800 rounded-2xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">BOOKING CODE</span>
              <span className="text-[#C5A059] font-bold text-sm">{bookingRef}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">STATUS</span>
              <span className="text-[#25D366] font-bold text-xs uppercase">PAID / GUARANTEED</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="text-white font-medium text-right">{bookingDetails.destinationTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vehicle:</span>
              <span className="text-white font-medium">{bookingDetails.vehicleName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Travel Date:</span>
              <span className="text-white font-medium">{bookingDetails.travelDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Party Size:</span>
              <span className="text-white font-medium">{bookingDetails.passengers} Guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lead Passenger:</span>
              <span className="text-white font-medium">{bookingDetails.guestName}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-slate-400 text-xs">Total Amount Paid:</span>
            <span className="text-lg font-bold text-[#C5A059]">¥{bookingDetails.amount.toLocaleString()} JPY</span>
          </div>
        </div>

        {/* Chauffeur Dispatch Info */}
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {lang === 'ja'
              ? '運行前日までに専属ドライバーの氏名・直通電話番号・車両ナンバーをご案内いたします。24時間体制で運行管理を行っております。'
              : 'Chauffeur details, vehicle plate number, and driver direct contact will be dispatched 24 hours prior to service.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={`https://wa.me/819000000000?text=${whatsAppAiText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
            <span>Connect with WhatsApp 24/7 Concierge</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors"
          >
            {lang === 'ja' ? '閉じる' : 'Return to Website'}
          </button>
        </div>
      </div>
    </div>
  );
}
