'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { CONTACT_ENDPOINT } from '@/lib/api';

const fieldClass =
  'w-full rounded-xl border border-[#E6E8EB] bg-white px-4 py-3 text-[1.3rem] leading-8 text-[#11181C] placeholder:text-[#687076] focus:border-[#FFAC1C] focus:outline-none focus:ring-2 focus:ring-[#FFAC1C]';
const labelClass = 'mb-2 block text-[1.3rem] font-semibold leading-8 text-[#11181C]';

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

  if (succeeded) {
    return (
      <div className="rounded-2xl border border-[#E6E8EB] bg-white p-6 text-[1.3rem] leading-8 text-[#11181C]">
        Thanks for contacting us. We&apos;ll get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-[#E6E8EB] bg-white p-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className={fieldClass}
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className={fieldClass}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={fieldClass}
          placeholder="+971 ..."
        />
      </div>

      <div>
        <label htmlFor="country" className={labelClass}>
          Country
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className={fieldClass}
        >
          <option value="">Select country</option>
          <option value="AE">United Arab Emirates</option>
          <option value="KE">Kenya</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={5}
          required
          className={`${fieldClass} resize-none`}
          placeholder="Tell us about your shipping needs..."
        />
      </div>

      {error ? (
        <p className="text-[1.3rem] leading-8 text-[#11181C]" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-xl bg-[#FFAC1C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#FFB84D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="mr-2 h-5 w-5" />
        {submitting ? 'Sending...' : 'Request a Quote'}
      </button>
    </form>
  );
}
