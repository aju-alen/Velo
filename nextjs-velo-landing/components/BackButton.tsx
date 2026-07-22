'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Go Back
    </button>
  );
}
