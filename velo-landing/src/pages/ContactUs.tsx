import React, { useState } from 'react';
import { Package, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { CONTACT_ENDPOINT } from '../lib/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to send message. Please try again.');
      }

      setSucceeded(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      details: 'support@velointl.com',
      description: 'Get detailed responses within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Office Location',
      details: 'Unit 201, Level 1, Zone South - Avenue G, DIFC Dubai',
      description: 'Visit us for in-person consultations',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 8AM-6PM ',
      description: 'Extended hours for premium clients',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-black">VELO</span>
                <div className="text-xs text-gray-600 font-medium tracking-wide">INTERNATIONAL SHIPPING</div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-black transition-colors font-medium">
                Services
              </a>
              <a href="#solutions" className="text-gray-700 hover:text-black transition-colors font-medium">
                Solutions
              </a>
              <a href="#about" className="text-gray-700 hover:text-black transition-colors font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-black transition-colors font-medium">
                Contact
              </a>
            </nav>
            <button className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="text-center py-16">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-[#FFAC1C]/10 text-[#FFAC1C] px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-[#FFAC1C]/20">
                <MessageSquare className="w-4 h-4 mr-2" />
                Get in Touch
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
                Contact
                <span className="block text-[#FFAC1C]">Our Team</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Have questions about our shipping services? Our expert team is here to help you with all
                your logistics needs.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-black mb-6">Send us a Message</h2>
                {succeeded ? (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    Thanks for contacting us! We&apos;ll get back to you soon.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAC1C] focus:border-[#FFAC1C] transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAC1C] focus:border-[#FFAC1C] transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAC1C] focus:border-[#FFAC1C] transition-colors"
                        placeholder="What is this regarding?"
                      />
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
                        placeholder="Tell us more about your inquiry..."
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
                      className="w-full inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-black mb-8">Get in Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#FFAC1C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-[#FFAC1C]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-1">{info.title}</h3>
                        <p className="text-gray-800 font-medium mb-1">{info.details}</p>
                        <p className="text-gray-600 text-sm">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-gray-50 rounded-2xl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-black mb-4">Frequently Asked Questions</h2>
                <p className="text-lg text-gray-600">Quick answers to common questions about our services</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-black mb-3">
                    How long does international shipping take?
                  </h3>
                  <p className="text-gray-600">Delivery times vary by the delivery organization.</p>
                </div>

                <div className="bg-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-black mb-3">Do you provide package tracking?</h3>
                  <p className="text-gray-600">
                    Yes, all shipments include real-time tracking. You&apos;ll receive a tracking number and
                    can monitor your package&apos;s journey from pickup to delivery.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-black mb-3">What countries do you ship to?</h3>
                  <p className="text-gray-600">
                    We provide shipping services to over 190 countries worldwide, including remote locations
                    and island nations.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
