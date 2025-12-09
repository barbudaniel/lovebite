import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Generate contract HTML for a given onboarding
function generateContractHtml(data: {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  idNumber: string;
  signatureUrl?: string;
  signedDate: string;
}) {
  const formattedAddress = [data.address, data.city, data.postalCode, data.country]
    .filter(Boolean)
    .join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agency Agreement - ${data.fullName}</title>
  <style>
    body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; color: #333; }
    h1 { text-align: center; font-size: 18px; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; }
    h2 { font-size: 14px; margin-top: 25px; margin-bottom: 10px; text-transform: uppercase; }
    p { margin: 10px 0; text-align: justify; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; }
    .logo span { color: #db2777; }
    .parties { margin: 20px 0; }
    .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
    .signature-block { width: 45%; }
    .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 10px; }
    .signature-img { max-height: 80px; margin-bottom: 10px; }
    .filled-field { color: #0066cc; font-weight: bold; }
    .date { margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">LOVEBITE<span>FANS</span></div>
    <p style="color: #666; margin-top: 5px;">Creator Management Agency</p>
  </div>

  <h1>EXCLUSIVE MANAGEMENT AND CONTENT AGENCY AGREEMENT</h1>

  <p>THIS AGREEMENT is made on <span class="filled-field">${data.signedDate}</span></p>

  <div class="parties">
    <p><strong>BETWEEN:</strong></p>
    <p>(1) TRUST CHARGE SOLUTIONS LTD, a private limited company incorporated in England and Wales, with its registered office at 20 Wenlock Road, London, England, N1 7GU, represented by Gabriel Cosoi ("The Agency" or "Partner A");</p>
    <p><strong>AND</strong></p>
    <p>(2) <span class="filled-field">${data.fullName}</span>, an individual residing at <span class="filled-field">${formattedAddress}</span>, (ID/Birth Reg No: <span class="filled-field">${data.idNumber}</span>) ("The Talent" or "Partner B").</p>
    <p>(Collectively referred to as the "Parties").</p>
  </div>

  <h2>1. BACKGROUND</h2>
  <p>1.1 Partner A operates as a management and marketing agency specializing in the representation of content creators on adult subscription-based platforms, including but not limited to OnlyFans, Fansly, and similar platforms ("the Platforms").</p>
  <p>1.2 Partner B wishes to engage Partner A on an exclusive basis to provide management, marketing, and operational support services in connection with Partner B's activities on the Platforms.</p>

  <h2>2. DURATION</h2>
  <p>2.1 This Agreement shall commence on the date of signing and continue for an initial term of twelve (12) months ("Initial Term").</p>
  <p>2.2 Following the Initial Term, this Agreement shall automatically renew for successive periods of twelve (12) months ("Renewal Terms") unless terminated in accordance with Clause 11.</p>

  <h2>3. RELATIONSHIP OF THE PARTIES</h2>
  <p>3.1 Partner B acknowledges and agrees that they are an independent contractor and not an employee of Partner A.</p>
  <p>3.2 Partner B retains exclusive ownership and control over all content created by them.</p>

  <h2>4. OBLIGATIONS OF THE TALENT ("PARTNER B")</h2>
  <p>4.1 Partner B shall:</p>
  <p>(a) Produce original content in accordance with any mutually agreed content schedule;</p>
  <p>(b) Maintain active profiles on the agreed Platforms;</p>
  <p>(c) Respond to subscriber messages in a timely manner;</p>
  <p>(d) Comply with all applicable laws and Platform terms of service;</p>
  <p>(e) Cooperate with Partner A in marketing and promotional activities.</p>

  <h2>5. OBLIGATIONS OF THE AGENCY ("PARTNER A")</h2>
  <p>5.1 Partner A shall:</p>
  <p>(a) Provide account management and operational support;</p>
  <p>(b) Develop and implement marketing strategies;</p>
  <p>(c) Handle subscriber engagement and messaging;</p>
  <p>(d) Provide analytics and performance reporting;</p>
  <p>(e) Advise on content optimization and growth strategies.</p>

  <h2>6. INTELLECTUAL PROPERTY AND CONSENT</h2>
  <p>6.1 Partner B retains all intellectual property rights in their content.</p>
  <p>6.2 Partner B grants Partner A a non-exclusive license to use their content for marketing purposes during the term of this Agreement.</p>

  <h2>7. FINANCIAL TERMS AND COMMISSION</h2>
  <p>7.1 Partner A shall receive a commission of thirty percent (30%) of all gross revenue generated through the Platforms.</p>
  <p>7.2 Commission shall be calculated and paid on a monthly basis.</p>
  <p>7.3 Partner A shall provide monthly statements detailing all revenue and commission calculations.</p>

  <h2>8. NON-COMPETE AND RESTRICTIVE COVENANTS</h2>
  <p>8.1 During the term of this Agreement, Partner B shall not engage any other agency or management service for Platform-related activities without prior written consent from Partner A.</p>

  <h2>9. BREACH AND LIQUIDATED DAMAGES</h2>
  <p>9.1 Either Party may terminate this Agreement immediately upon material breach by the other Party.</p>
  <p>9.2 Upon early termination by Partner B without cause, Partner B may be liable for liquidated damages as specified herein.</p>

  <h2>10. CONFIDENTIALITY</h2>
  <p>10.1 Both Parties agree to maintain strict confidentiality regarding all business information, strategies, and financial data.</p>

  <h2>11. TERMINATION</h2>
  <p>11.1 Either Party may terminate this Agreement by providing sixty (60) days' written notice.</p>
  <p>11.2 Upon termination, Partner A shall be entitled to commission on revenue generated during the notice period.</p>

  <h2>12. DATA PROTECTION (UK GDPR)</h2>
  <p>12.1 Both Parties agree to comply with all applicable data protection laws, including the UK GDPR.</p>
  <p>12.2 Partner A shall process personal data only in accordance with Partner B's instructions and applicable law.</p>

  <h2>13. GENERAL PROVISIONS</h2>
  <p>13.1 This Agreement constitutes the entire agreement between the Parties.</p>
  <p>13.2 This Agreement shall be governed by the laws of England and Wales.</p>
  <p>13.3 Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

  <div class="signature-section">
    <div class="signature-block">
      <p><strong>For and on behalf of Partner A:</strong></p>
      <p>TRUST CHARGE SOLUTIONS LTD</p>
      <div class="signature-line">
        <p>Authorized Signatory</p>
      </div>
    </div>
    <div class="signature-block">
      <p><strong>Partner B:</strong></p>
      <p>${data.fullName}</p>
      ${data.signatureUrl ? `<img src="${data.signatureUrl}" alt="Signature" class="signature-img" />` : ''}
      <div class="signature-line">
        <p>Signature</p>
        <p class="date">Date: ${data.signedDate}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Onboarding ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Get onboarding data
    const { data: onboarding, error } = await supabase
      .from('onboardings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !onboarding) {
      return NextResponse.json({ error: 'Onboarding not found' }, { status: 404 });
    }

    // Get signature URL if exists
    let signatureUrl: string | undefined;
    if (onboarding.signature_path) {
      const { data: urlData } = supabase.storage
        .from('onboarding-documents')
        .getPublicUrl(onboarding.signature_path);
      signatureUrl = urlData.publicUrl;
    }

    const contractHtml = generateContractHtml({
      fullName: onboarding.full_name || 'N/A',
      address: onboarding.address || '',
      city: onboarding.city || '',
      postalCode: onboarding.postal_code || '',
      country: onboarding.country || '',
      idNumber: onboarding.id_number || 'N/A',
      signatureUrl,
      signedDate: onboarding.contract_signed_at 
        ? new Date(onboarding.contract_signed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    });

    // Return HTML for download
    return new NextResponse(contractHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="Contract_${onboarding.full_name?.replace(/\s+/g, '_') || 'Unsigned'}.html"`,
      },
    });

  } catch (error) {
    console.error('Failed to generate contract:', error);
    return NextResponse.json({ error: 'Failed to generate contract' }, { status: 500 });
  }
}



