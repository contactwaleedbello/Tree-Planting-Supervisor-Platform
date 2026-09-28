import React, { useEffect, useState } from 'react';
import {
  getSupportFaqsPlaceholder,
  submitSupportInquiryPlaceholder,
  SupportFaqCategory,
} from '../../services/shellPlaceholder';
import { AlertToast } from './AlertToast';

/**
 * AccountProfileSupport: Profile (Support) tab, incorporating FAQs accordion (Frame 1707479589.png)
 * and Reach out to the Team contact form with contact cards (Profile (Support).png).
 */
export const AccountProfileSupport: React.FC = () => {
  const [categories, setCategories] = useState<SupportFaqCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('green-legacy');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setIsLoadingFaqs(true);
        const data = await getSupportFaqsPlaceholder();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0].id);
          if (data[0].faqs.length > 0) {
            setOpenFaqId(data[0].faqs[0].id);
          }
        }
        setIsLoadingFaqs(false);
      } catch {
        setIsLoadingFaqs(false);
      }
    };
    fetchFaqs();
  }, []);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setFormError('Please enter your full name, email, and message.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      const res = await submitSupportInquiryPlaceholder({
        fullName,
        email,
        phoneNumber: phone,
        message,
      });
      setFormSuccess(res.message);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setIsSubmitting(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setFormError(err.message || 'Failed to submit inquiry. Try again.');
    }
  };

  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Contact Us: Reach out to the Team Form */}
      <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-2xl p-6 sm:p-8 shadow-xs">
        <span className="text-xs font-semibold text-[#5E625E] uppercase tracking-wider block mb-2">
          Contact us
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Heading & Illustration */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#1C211B] leading-tight">
                Reach out to the Team
              </h3>
              <p className="text-xs text-[#5E625E] mt-2 leading-relaxed">
                Our team will contact you within 24 hours of your inquiry.
              </p>
            </div>

            {/* Illustration */}
            <div className="mt-8 flex justify-center lg:justify-start">
              <svg className="w-56 h-48 text-[#1C211B]" viewBox="0 0 200 180" fill="currentColor">
                {/* Headset support agent SVG icon */}
                <path d="M100 20 C70 20, 50 40, 50 65 L50 90 C45 92, 40 98, 40 105 C40 112, 45 118, 50 120 L50 125 C50 145, 75 160, 100 160 C125 160, 150 145, 150 125 L150 120 C155 118, 160 112, 160 105 C160 98, 155 92, 150 90 L150 65 C150 40, 130 20, 100 20 Z" fill="#2E5421" opacity="0.15" />
                <circle cx="100" cy="70" r="30" fill="#2A2F29" />
                {/* Headset band */}
                <path d="M68 70 A32 32 0 0 1 132 70" fill="none" stroke="#1C211B" strokeWidth="6" strokeLinecap="round" />
                <rect x="64" y="62" width="8" height="18" rx="4" fill="#1C211B" />
                <rect x="128" y="62" width="8" height="18" rx="4" fill="#1C211B" />
                {/* Headset microphone */}
                <path d="M70 76 Q76 96 95 96" fill="none" stroke="#1C211B" strokeWidth="4" strokeLinecap="round" />
                <circle cx="97" cy="96" r="4" fill="#1C211B" />
                {/* Body/Shoulders */}
                <path d="M60 135 C60 115, 140 115, 140 135 L155 165 C155 170, 45 170, 45 165 Z" fill="#2A2F29" />
                {/* Laptop base */}
                <rect x="35" y="145" width="130" height="25" rx="5" fill="#1C211B" />
                <circle cx="100" cy="157" r="5" fill="#FAFCFE" />
              </svg>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            {formSuccess && (
              <div className="mb-4">
                <AlertToast
                  variant="success"
                  title="Message Sent"
                  message={formSuccess}
                  onClose={() => setFormSuccess(null)}
                />
              </div>
            )}

            {formError && (
              <div className="mb-4">
                <AlertToast
                  variant="error"
                  title="Submission Error"
                  message={formError}
                  onClose={() => setFormError(null)}
                />
              </div>
            )}

            <form onSubmit={handleSupportSubmit} className="space-y-4 text-left">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-[#1C211B] block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B7E7B]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAFCFE] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-[#1C211B] block mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B7E7B]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAFCFE] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-semibold text-[#1C211B] block mb-1.5">
                  Phone Number
                </label>
                <div className="flex border border-[#CBCDCE] rounded-xl overflow-hidden bg-[#FAFCFE] focus-within:border-[#3C7429] focus-within:ring-1 focus-within:ring-[#3C7429] transition-colors">
                  <div className="flex items-center gap-1.5 px-3 bg-[#EEF0F2] border-r border-[#CBCDCE] text-xs text-[#424641] shrink-0">
                    <span className="text-base">🇳🇬</span>
                    <svg className="w-3.5 h-3.5 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-transparent text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none"
                  />
                </div>
              </div>

              {/* Team Message */}
              <div>
                <label className="text-xs font-semibold text-[#1C211B] block mb-1.5">
                  Team Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g placeholder"
                  required
                  className="w-full px-4 py-3 bg-[#FAFCFE] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2E5421] hover:bg-[#213819] active:bg-[#131811] text-[#FAFCFE] text-xs font-semibold transition-all shadow-sm disabled:opacity-50 focus:outline-none"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Contact Us</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 3 Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#EEF0F2]">
          {/* Card 1: Visit Us */}
          <div className="bg-[#FAFCFE] border border-[#EEF0F2] rounded-xl p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF7EE] flex items-center justify-center text-[#3C7429]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-[#1C211B]">Visit Us</h4>
            <p className="text-xs text-[#5E625E] leading-relaxed">
              Green Legacy Kano & Abuja, FCT, Nigeria
            </p>
          </div>

          {/* Card 2: Call Us */}
          <div className="bg-[#FAFCFE] border border-[#EEF0F2] rounded-xl p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF7EE] flex items-center justify-center text-[#3C7429]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-[#1C211B]">Call Us</h4>
            <p className="text-xs text-[#5E625E] font-medium">+234 803 786 0536</p>
            <p className="text-[11px] text-[#7B7E7B]">Mon – Fri, 9am – 5pm</p>
          </div>

          {/* Card 3: Email Us */}
          <div className="bg-[#FAFCFE] border border-[#EEF0F2] rounded-xl p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF7EE] flex items-center justify-center text-[#3C7429]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-[#1C211B]">Email Us</h4>
            <p className="text-xs text-[#5E625E] font-medium">mail@greenlegacy.africa</p>
            <p className="text-[11px] text-[#7B7E7B]">We reply within 24 hours</p>
          </div>
        </div>
      </div>

      {/* 2. FAQs Section (Frame 1707479589.png) */}
      <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-2xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-[#1C211B] mb-6">FAQs</h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Category List */}
          <div className="md:col-span-4 flex flex-col gap-2">
            {categories.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    if (cat.faqs.length > 0) {
                      setOpenFaqId(cat.faqs[0].id);
                    }
                  }}
                  className={`text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#F7EADE] text-[#936B40]'
                      : 'text-[#1C211B] hover:bg-[#EEF0F2]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Right Accordion */}
          <div className="md:col-span-8 flex flex-col gap-3">
            {isLoadingFaqs ? (
              <div className="p-8 text-center text-xs text-[#7B7E7B]">Loading FAQs...</div>
            ) : activeCategory ? (
              activeCategory.faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-xl border border-[#EEF0F2] overflow-hidden transition-all ${
                      isOpen ? 'bg-[#F4F6F8]' : 'bg-[#FAFCFE]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-[#1C211B] focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      <svg
                        className={`w-4 h-4 text-[#7B7E7B] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[#5E625E] leading-relaxed border-t border-[#E2E5E6]/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
