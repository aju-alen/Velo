'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Download,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Radar,
  Send,
} from 'lucide-react';
import { siteConfig } from '@/lib/seo/site';
import MapPlaceholder from '@/components/sections/MapPlaceholder';
import { CONTACT_ENDPOINT } from '@/lib/api';

const phoneDigits = siteConfig.phone.replace(/\D/g, '');
const whatsappHref = `https://wa.me/${phoneDigits}`;
const officeAddress = `${siteConfig.address.street}, ${siteConfig.address.region} ${siteConfig.address.city}`;

const reachCards = [
  {
    title: 'Request a Quote',
    description: "Tell us about your shipment and we'll help you understand your options.",
    href: '#quote-form',
    icon: Send,
  },
  {
    title: 'Schedule a Pickup',
    description: 'Arrange collection directly through the Velo platform.',
    href: '/download-app',
    icon: Package,
  },
  {
    title: 'Track Your Shipment',
    description: 'Follow progress throughout the shipping process.',
    href: '/track-shipment',
    icon: Radar,
  },
  {
    title: 'Download the App',
    description: 'Manage shipments from your phone.',
    href: '/download-app',
    icon: Download,
  },
];

const commonQuestions = [
  {
    question: 'Can You Pick Up From My Location?',
    answer: 'Pickup is intended to cover locations throughout Dubai and the UAE.',
  },
  {
    question: 'Do You Deliver Outside Nairobi?',
    answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
  },
  {
    question: 'Can I Ship Commercial Cargo?',
    answer: 'Yes. Velo supports personal shipments, commercial inventory, and larger cargo.',
  },
  {
    question: 'Can I Track My Shipment?',
    answer: 'Yes. Tracking updates are available throughout the process.',
  },
  {
    question: 'How Are Costs Calculated?',
    answer: 'Pricing depends on the details of your shipment and can be estimated through the platform.',
  },
];

const prepDetails = [
  'What You\'re Shipping',
  'Approximate Weight',
  'Approximate Dimensions',
  'Preferred Shipping Method',
  'Destination in Kenya',
];

const faqs = [
  {
    question: 'Where is Velo based?',
    answer:
      'Velo operates from Dubai and focuses on shipments between international markets and Kenya. We are a shipping company in Dubai serving cargo services Dubai to Kenya.',
  },
  {
    question: 'Can I schedule pickups through the app?',
    answer: 'Yes. Pickup requests are handled through the Velo platform.',
  },
  {
    question: 'What types of cargo can you handle?',
    answer: 'Everything from documents and personal parcels to commercial cargo and heavy machinery.',
  },
  {
    question: 'Do you deliver outside Nairobi?',
    answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
  },
  {
    question: 'Can I track my shipment?',
    answer: 'Yes. Tracking updates are available throughout the process.',
  },
  {
    question: 'Is Velo only for businesses?',
    answer: 'No. Individuals and businesses can both use Velo.',
  },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          country: formData.country,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to send message. Please try again.');
      }

      setSucceeded(true);
      setFormData({ name: '', email: '', phone: '', country: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [

    {
      icon: Mail,
      title: 'Email',
      details: siteConfig.email,
      description: 'Get detailed responses within 24 hours',
      href: `mailto:${siteConfig.email}`,
    },
   
    {
      icon: MapPin,
      title: 'Dubai Office',
      details: officeAddress,
      description: 'Visit us for in-person consultations',
      href: undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-12 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-6">
            Sometimes You Just Want an Answer
          </h1>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed mb-8">
            <p>
              Not every shipment starts with a quote. Sometimes you want to know whether something can
              be shipped. Sometimes you&apos;re comparing options. Sometimes you&apos;re trying to understand
              costs. And sometimes, you simply want to speak to someone before making a decision.
            </p>
            <p>
              That&apos;s perfectly reasonable. Shipping can involve important documents, valuable cargo,
              business inventory, or things that matter to the people receiving them. Questions are
              part of the process. And getting answers shouldn&apos;t feel difficult.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="#quote-form"
              className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors font-semibold"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/download-app"
              className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 border border-gray-300 px-7 py-3.5 rounded-full hover:border-black transition-colors font-semibold"
            >
              Download the App
            </Link>
          </div>
        </section>

        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFAC1C] mb-4">Reach Us</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
            You Shouldn&apos;t Have to Wonder How to Reach Us
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed max-w-3xl mb-8">
            <p>
              Some companies make contacting them harder than it needs to be. Long waiting times.
              Messages that disappear. Conversations that start over every time.
            </p>
            <p>
              People remember those experiences. Not because they were exceptional. Because they were
              frustrating. We believe communication should be straightforward. Because confidence
              starts long before a shipment moves.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {reachCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="rounded-2xl border border-gray-200 p-6 hover:border-[#FFAC1C]/40 transition-colors"
                >
                  <Icon className="w-6 h-6 text-[#FFAC1C] mb-4" />
                  <h3 className="text-lg font-bold text-black mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="quote-form" className="scroll-mt-28 py-12 border-t border-gray-100">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">Request a Quote</h2>
              {succeeded ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  Thanks for contacting us! We&apos;ll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-11 focus:ring-2 focus:ring-[#FFAC1C] focus:border-[#FFAC1C] transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-11 focus:ring-2 focus:ring-[#FFAC1C] focus:border-[#FFAC1C] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-11 focus:ring-2 focus:ring-[#FFAC1C] focus:border-[#FFAC1C] transition-colors"
                      placeholder="+971 ..."
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-11 bg-white focus:ring-2 focus:ring-[#FFAC1C] focus:border-[#FFAC1C] transition-colors"
                    >
                      <option value="">Select country</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="KE">Kenya</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAC1C] focus:border-[#FFAC1C] transition-colors resize-none"
                      placeholder="Tell us about your shipping needs..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center min-h-11 bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Request a Quote
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#FFAC1C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-[#FFAC1C]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-1">{info.title}</h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-gray-800 font-medium mb-1 hover:text-[#FFAC1C] transition-colors block"
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-gray-800 font-medium mb-1">{info.details}</p>
                      )}
                      <p className="text-gray-600 text-sm">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFAC1C] mb-4">
            Common Questions
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
            What People Usually Ask Before They Ship
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Most questions fall into familiar categories.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {commonQuestions.map((item) => (
              <div key={item.question} className="rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-black mb-2">{item.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFAC1C] mb-4">Business</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
            If You&apos;re Shipping Regularly
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed max-w-3xl mb-8">
            <p>
              One shipment is a transaction. Recurring shipments are a relationship. Businesses often
              have different requirements. Regular inventory movement. Larger consignments. Multiple
              destinations. Long-term planning.
            </p>
            <p>
              Those conversations deserve more than a one-size-fits-all answer. If your business ships
              regularly between Dubai and Kenya, we&apos;d like to understand what you&apos;re trying to
              achieve. Because better logistics start with better conversations.
            </p>
          </div>
          <Link
            href="/business-shipping"
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors font-semibold"
          >
            Explore Business Shipping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </section>

        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFAC1C] mb-4">Prepare</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">Before You Reach Out</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed max-w-3xl mb-8">
            <p>
              A few minutes spent gathering information can save a lot of back-and-forth later. If
              possible, have these details ready:
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
            {prepDetails.map((detail) => (
              <li
                key={detail}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-black"
              >
                {detail}
              </li>
            ))}
          </ul>
          <p className="text-gray-600 mt-6 max-w-3xl">
            The more accurate the information, the easier it becomes to provide meaningful guidance.
          </p>
        </section>

        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl bg-gray-50 border border-gray-200 overflow-hidden open:border-[#FFAC1C]/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold text-black min-h-11">
                  {faq.question}
                  <span className="text-[#FFAC1C] text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <MapPlaceholder />

        <section className="mt-12 rounded-2xl bg-gradient-to-r from-[#FFAC1C] to-[#FFB84D] p-8 text-center">
          <h2 className="text-2xl font-bold text-black mb-3">
            Every Shipment Starts With A Conversation
          </h2>
          <p className="text-black/70 mb-6 max-w-2xl mx-auto leading-relaxed">
            Maybe you&apos;re ready for a quote. Maybe you still have questions. Either way,
            you&apos;re welcome to reach out. Because making informed decisions is easier when you
            have the information you need.
          </p>
          <Link
            href="#quote-form"
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors font-semibold"
          >
            Request a Quote
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </section>
      </div>
    </div>
  );
}
