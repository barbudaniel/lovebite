"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar, Building2 } from "lucide-react";
import { Navigation, Footer } from "@/components/sections";

export default function TermsPage() {
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
                <FileText className="w-8 h-8 text-brand-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Terms & Conditions
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
                    Welcome to Lovdash. These Terms and Conditions (&quot;Terms&quot;) govern your use of the Lovdash platform, 
                    website, and services (collectively, the &quot;Services&quot;) operated by TRUST CHARGE SOLUTIONS LTD 
                    (Company number 16584325), referred to as &quot;we,&quot; &quot;us,&quot; or &quot;the Company.&quot;
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    By accessing or using our Services, you agree to be bound by these Terms. If you disagree with 
                    any part of these Terms, you may not access or use our Services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Eligibility</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Our Services are intended for users who are at least 18 years old. By using our Services, 
                    you represent and warrant that:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>You are at least 18 years of age</li>
                    <li>You have the legal capacity to enter into a binding agreement</li>
                    <li>You are not prohibited from using our Services under applicable laws</li>
                    <li>You will provide accurate and complete information during registration</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Services Description</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Lovdash provides content creator management services, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Media content management and organization tools</li>
                    <li>AI-powered content tagging and categorization</li>
                    <li>Bio link creation and management</li>
                    <li>Analytics and performance tracking</li>
                    <li>Platform account management assistance</li>
                    <li>Marketing and promotional support</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">4. User Accounts</h2>
                  <p className="text-slate-600 leading-relaxed">
                    When you create an account with us, you must provide accurate, complete, and current information. 
                    You are responsible for safeguarding the password and for all activities that occur under your account.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    You agree to:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Notify us immediately of any unauthorized access to your account</li>
                    <li>Not share your account credentials with third parties</li>
                    <li>Not create multiple accounts for the purpose of abusing our Services</li>
                    <li>Keep your contact information up to date</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Content Guidelines</h2>
                  <p className="text-slate-600 leading-relaxed">
                    You retain ownership of content you upload to our platform. By uploading content, you grant us a 
                    non-exclusive, worldwide, royalty-free license to use, store, and process your content solely for 
                    the purpose of providing our Services.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    You are solely responsible for ensuring your content:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Does not violate any applicable laws or regulations</li>
                    <li>Does not infringe upon the rights of any third party</li>
                    <li>Features only individuals who are at least 18 years old and have given consent</li>
                    <li>Complies with the terms of any third-party platforms you use in conjunction with our Services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Fees and Payment</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Certain features of our Services may be subject to fees. By using paid features, you agree to pay 
                    all applicable fees as described on our platform. All fees are non-refundable unless otherwise stated.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    We reserve the right to modify our pricing at any time. Any price changes will be communicated to 
                    you in advance and will not affect existing subscriptions until their renewal date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
                  <p className="text-slate-600 leading-relaxed">
                    The Lovdash platform, including its original content, features, and functionality, is owned by 
                    TRUST CHARGE SOLUTIONS LTD and is protected by international copyright, trademark, patent, trade 
                    secret, and other intellectual property laws.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    You may not copy, modify, distribute, sell, or lease any part of our Services without our express 
                    written permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
                  <p className="text-slate-600 leading-relaxed">
                    To the maximum extent permitted by law, TRUST CHARGE SOLUTIONS LTD shall not be liable for any 
                    indirect, incidental, special, consequential, or punitive damages, or any loss of profits or 
                    revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other 
                    intangible losses resulting from:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Your access to or use of or inability to access or use the Services</li>
                    <li>Any conduct or content of any third party on the Services</li>
                    <li>Any content obtained from the Services</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Termination</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We may terminate or suspend your account and access to our Services immediately, without prior 
                    notice or liability, for any reason, including without limitation if you breach these Terms.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Upon termination, your right to use the Services will immediately cease. If you wish to terminate 
                    your account, you may do so by contacting us or using the account deletion feature in your settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to Terms</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                    we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes 
                    a material change will be determined at our sole discretion.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Governing Law</h2>
                  <p className="text-slate-600 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of England and Wales, 
                    without regard to its conflict of law provisions. Any disputes arising from these Terms will be 
                    subject to the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Information</h2>
                  <p className="text-slate-600 leading-relaxed">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6 mt-4">
                    <p className="text-slate-900 font-semibold">TRUST CHARGE SOLUTIONS LTD</p>
                    <p className="text-slate-600">Company number: 16584325</p>
                    <p className="text-slate-600 mt-2">
                      Email: <a href="mailto:legal@lovdash.com" className="text-brand-600 hover:text-brand-700">legal@lovdash.com</a>
                    </p>
                  </div>
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
