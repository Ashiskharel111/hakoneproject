import { NextRequest, NextResponse } from 'next/server';
import { saveInquiry, generateDocumentId } from '@/lib/firebase';

const OPS_NOTIFICATION_EMAIL = 'tours@sk.limo';

interface InquiryRequestBody {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  date?: string;
  guests?: string | number;
  message?: string;
  lang?: string;
}

/**
 * Dispatch an email notification to tours@sk.limo
 */
async function sendInquiryEmail(data: {
  docId: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  date: string;
  guests: string | number;
  message: string;
}) {
  const subject = `[New Inquiry] ${data.name} - ${data.serviceType} (${data.date || 'Date TBD'}) [${data.docId}]`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: #080B11; padding: 24px 32px; text-align: center; border-bottom: 2px solid #C5A059; }
          .header h1 { color: #C5A059; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
          .header p { color: #94a3b8; font-size: 12px; margin: 4px 0 0; }
          .body-content { padding: 32px; }
          .doc-badge { display: inline-block; background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-family: monospace; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; margin-bottom: 20px; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          .info-table th { width: 35%; text-align: left; padding: 10px 12px; background: #f8fafc; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
          .info-table td { width: 65%; text-align: left; padding: 10px 12px; color: #0f172a; font-size: 13px; font-weight: 500; border-bottom: 1px solid #e2e8f0; }
          .message-box { margin-top: 24px; padding: 16px; background: #faf8f4; border: 1px solid #e8e2d8; border-radius: 12px; }
          .message-box h3 { margin: 0 0 8px; font-size: 13px; color: #8C6D3F; text-transform: uppercase; font-weight: 700; }
          .message-box p { margin: 0; font-size: 13px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
          .footer { background: #f8fafc; padding: 16px 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SK LIMO JAPAN</h1>
            <p>Executive Private Chauffeur & Charter Inquiries</p>
          </div>
          <div class="body-content">
            <div class="doc-badge">Document ID: ${data.docId}</div>
            <table class="info-table">
              <tr>
                <th>Customer Name</th>
                <td><strong>${data.name}</strong></td>
              </tr>
              <tr>
                <th>Email Address</th>
                <td><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr>
                <th>Phone / WhatsApp</th>
                <td>${data.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <th>Service Requested</th>
                <td><span style="color: #C5A059; font-weight: 700;">${data.serviceType}</span></td>
              </tr>
              <tr>
                <th>Travel Date</th>
                <td>${data.date || 'Flexible / TBD'}</td>
              </tr>
              <tr>
                <th>Guests (Pax)</th>
                <td>${data.guests || '2'} Guests</td>
              </tr>
              <tr>
                <th>Received At</th>
                <td>${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} (JST)</td>
              </tr>
            </table>

            ${
              data.message
                ? `
            <div class="message-box">
              <h3>Special Requests & Itinerary Details</h3>
              <p>${data.message}</p>
            </div>
            `
                : ''
            }
          </div>
          <div class="footer">
            SK LIMO Japan Operations Desk &bull; Target recipient: ${OPS_NOTIFICATION_EMAIL}
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
[NEW INQUIRY RECEIVED]
Document ID: ${data.docId}
Customer Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Service: ${data.serviceType}
Date: ${data.date || 'TBD'}
Guests: ${data.guests || '2'}
Message / Requests:
${data.message || 'No additional notes'}
Received: ${new Date().toISOString()}
Target: ${OPS_NOTIFICATION_EMAIL}
  `.trim();

  // If Resend API key is present, send through Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'SK Limo <inquiry@sk.limo>',
          to: [OPS_NOTIFICATION_EMAIL],
          reply_to: data.email,
          subject,
          html: htmlContent,
          text: textContent,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn('[INQUIRY EMAIL] Resend dispatch warning:', errorText);
      } else {
        console.log(`[INQUIRY EMAIL] Successfully sent email to ${OPS_NOTIFICATION_EMAIL} for doc ${data.docId}`);
      }
    } catch (emailErr) {
      console.error('[INQUIRY EMAIL] Error during Resend API call:', emailErr);
    }
  } else {
    // Log complete email payload when no external mail gateway is configured
    console.log(`[INQUIRY EMAIL NOTIFICATION DISPATCHED] To: ${OPS_NOTIFICATION_EMAIL}`);
    console.log(`Subject: ${subject}`);
    console.log(textContent);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InquiryRequestBody;

    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const serviceType = (body.serviceType || 'custom_inquiry').trim();
    const date = (body.date || '').trim();
    const guests = body.guests || '2';
    const message = (body.message || '').trim();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    // 1. Generate Custom Document ID: 3 letters of first name + date/time + cramped email
    const docId = generateDocumentId(name, email);

    // 2. Save to 'inquires' collection in Firestore
    const savedDocId = await saveInquiry({
      name,
      email,
      phone,
      serviceType,
      date,
      guests,
      message,
      docId,
      status: 'new',
    });

    // 3. Send email to tours@sk.limo
    await sendInquiryEmail({
      docId,
      name,
      email,
      phone,
      serviceType,
      date,
      guests,
      message,
    });

    return NextResponse.json({
      success: true,
      docId: savedDocId || docId,
      message: 'Inquiry received and recorded successfully.',
    });
  } catch (error: any) {
    console.error('[INQUIRY API ERROR]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while processing your inquiry.',
      },
      { status: 500 }
    );
  }
}
