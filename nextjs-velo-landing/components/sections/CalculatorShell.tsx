'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import DownloadAppLink from '@/components/DownloadAppLink';
import SectionLabel from './SectionLabel';

export default function CalculatorShell() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="calculator" className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>Calculator</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">Calculate Shipping Costs</h2>
      <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl">
        Shipping costs vary depending on the shipper, cargo details, and delivery requirements. Enter
        your shipment details below to get started — for accurate pricing, download the Velo app.
      </p>
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 lg:p-8">
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Origin</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-11"
              defaultValue="Dubai, UAE"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-11 bg-white">
              <option>Nairobi, Kenya</option>
              <option>Mombasa, Kenya</option>
              <option>Other Kenya</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-11"
              placeholder="e.g. 5"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dimensions (L x W x H cm)
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-11"
              placeholder="e.g. 30 x 20 x 15"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-11 bg-white">
              <option>Personal Parcel</option>
              <option>Documents</option>
              <option>Electronics</option>
              <option>Commercial Cargo</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full sm:w-auto min-h-11 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900"
            >
              Continue
            </button>
          </div>
        </form>
        {submitted && (
          <div className="mt-8 p-6 rounded-xl bg-white border border-[#FFAC1C]/30">
            <p className="text-gray-700 mb-2 font-semibold">We don&apos;t show a fixed shipping cost here.</p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Rates vary by shipper and the details of your cargo. For an accurate quote based on your
              shipment, download the Velo app and get pricing there.
            </p>
            <DownloadAppLink className="inline-flex items-center font-semibold text-black hover:text-[#FFAC1C] min-h-11">
              Download the App <ArrowRight className="w-4 h-4 ml-2" />
            </DownloadAppLink>
          </div>
        )}
      </div>
    </section>
  );
}
