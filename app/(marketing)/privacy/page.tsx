"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Shield, Calendar, Building2 } from "lucide-react";
import { Navigation, Footer } from "@/components/sections";

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-2xl mb-6">
                <Shield className="w-8 h-8 text-brand-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Privacy Policy
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Last updated: January 9, 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  TRUST CHARGE SOLUTIONS LTD
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-slate prose-lg max-w-none"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-8">
                
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                  <p className="text-slate-600 leading-relaxed">
                    TRUST CHARGE SOLUTIONS LTD (Company number 16584325), operating as Lovdash (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), 
                    is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, 
                    and safeguard your information when you use our platform and services.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that 
                    you have read, understood, and agree to be bound by this Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">2.1 Personal Information</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We may collect personal information that you voluntarily provide when using our Services, including:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Name, email address, and phone number</li>
                    <li>Date of birth (to verify age eligibility)</li>
                    <li>Profile information and photos</li>
                    <li>Payment and billing information</li>
                    <li>Identity verification documents</li>
                    <li>Social media account information</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">2.2 Content Data</h3>
                  <p className="text-slate-600 leading-relaxed">
                    When you use our content management features, we process:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Photos, videos, and audio files you upload</li>
                    <li>Content metadata (file names, sizes, formats)</li>
                    <li>AI-generated tags and categorizations</li>
                    <li>Bio link content and configurations</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">2.3 Automatically Collected Information</h3>
                  <p className="text-slate-600 leading-relaxed">
                    When you access our Services, we automatically collect certain information:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>IP address and device information</li>
                    <li>Browser type and operating system</li>
                    <li>Pages viewed and features used</li>
                    <li>Time and date of visits</li>
                    <li>Referring URLs and search terms</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We use collected information for various purposes, including:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Providing and maintaining our Services</li>
                    <li>Processing transactions and managing your account</li>
                    <li>Sending administrative notifications and updates</li>
                    <li>Providing customer support and responding to inquiries</li>
                    <li>Analyzing usage patterns to improve our Services</li>
                    <li>Detecting and preventing fraud and abuse</li>
                    <li>Complying with legal obligations</li>
                    <li>AI-powered content analysis and tagging</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>
                      <strong>Service Providers:</strong> We may share information with third-party vendors who perform 
                      services on our behalf, such as hosting, payment processing, and analytics.
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, 
                      your information may be transferred as part of that transaction.
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> We may disclose information if required by law or in response 
                      to valid legal requests from public authorities.
                    </li>
                    <li>
                      <strong>Protection of Rights:</strong> We may disclose information to protect our rights, privacy, 
                      safety, or property, or that of our users or others.
                    </li>
                    <li>
                      <strong>With Your Consent:</strong> We may share information for other purposes with your explicit consent.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your personal 
                    information, including:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and audits</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Secure data centers with physical security measures</li>
                    <li>Employee training on data protection practices</li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-4">
                    However, no method of transmission over the Internet or electronic storage is 100% secure. 
                    While we strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in 
                    this Privacy Policy, unless a longer retention period is required or permitted by law. When we no 
                    longer need your information, we will securely delete or anonymize it.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Content you upload may be retained for the duration of your account plus a reasonable period 
                    afterward to allow for account restoration or to comply with legal obligations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights and Choices</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request that we delete your personal information</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
                    <li><strong>Restriction:</strong> Request that we limit how we use your information</li>
                    <li><strong>Objection:</strong> Object to our processing of your information</li>
                    <li><strong>Withdrawal of Consent:</strong> Withdraw consent where we rely on it for processing</li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-4">
                    To exercise these rights, please contact us using the information provided below.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies and Tracking Technologies</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We use cookies and similar tracking technologies to track activity on our Services and hold 
                    certain information. Cookies are small data files placed on your device that help us improve 
                    our Services and your experience.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Types of cookies we use:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for the operation of our Services</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Services</li>
                    <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-4">
                    You can manage your cookie preferences through your browser settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">9. International Data Transfers</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Your information may be transferred to and processed in countries other than your country of 
                    residence. These countries may have data protection laws that are different from the laws of 
                    your country. We take appropriate safeguards to ensure that your personal information remains 
                    protected in accordance with this Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Children&apos;s Privacy</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Our Services are not intended for individuals under the age of 18. We do not knowingly collect 
                    personal information from children. If we become aware that we have collected personal information 
                    from a child, we will take steps to delete that information immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to This Privacy Policy</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                    the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to 
                    review this Privacy Policy periodically for any changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Us</h2>
                  <p className="text-slate-600 leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6 mt-4">
                    <p className="text-slate-900 font-semibold">TRUST CHARGE SOLUTIONS LTD</p>
                    <p className="text-slate-600">Company number: 16584325</p>
                    <p className="text-slate-600 mt-2">
                      Email: <a href="mailto:privacy@lovdash.com" className="text-brand-600 hover:text-brand-700">privacy@lovdash.com</a>
                    </p>
                    <p className="text-slate-600">
                      For data protection inquiries: <a href="mailto:dpo@lovdash.com" className="text-brand-600 hover:text-brand-700">dpo@lovdash.com</a>
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Complaints</h2>
                  <p className="text-slate-600 leading-relaxed">
                    If you believe we have not handled your personal information properly, you have the right to lodge 
                    a complaint with your local data protection authority. In the UK, this is the Information 
                    Commissioner&apos;s Office (ICO): <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">https://ico.org.uk</a>
                  </p>
                </section>

              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer variant="light" />
    </>
  );
}
