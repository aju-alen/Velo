'use client';

import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

export default function TrackingShell() {
  return (
    <div className="relative max-w-xl">
      <div
        className="flex flex-col sm:flex-row gap-3 pointer-events-none select-none opacity-40"
        aria-hidden="true"
      >
        <input
          type="text"
          tabIndex={-1}
          readOnly
          value=""
          placeholder="Enter tracking number"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg min-h-11 bg-white"
        />
        <button
          type="button"
          tabIndex={-1}
          className="inline-flex items-center justify-center gap-2 min-h-11 bg-black text-white px-8 py-3 rounded-full font-semibold w-full sm:w-auto"
        >
          <Search className="w-4 h-4" />
          Track
        </button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm px-6 py-5 text-center max-w-sm mx-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFAC1C] mb-2">
            Coming Soon
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Web tracking is on the way. For now, track your shipments in the Velo app.
          </p>
          <Link
            href="/download-app"
            className="inline-flex items-center justify-center min-h-11 text-sm font-semibold text-black hover:text-[#FFAC1C] transition-colors"
          >
            Download the App
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
