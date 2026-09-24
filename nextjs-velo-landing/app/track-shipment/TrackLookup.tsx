'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TrackLookup() {
  const [number, setNumber] = useState('');
  const [checked, setChecked] = useState('');

  return (
    <form
      className="mt-8 max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        setChecked(number.trim());
      }}
    >
      <label htmlFor="tracking-number" className="mb-2 block text-[1.3rem] font-semibold leading-8 text-[#11181C]">
        Tracking number
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="tracking-number"
          name="tracking-number"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          placeholder="e.g. VEL-000000"
          required
          className="min-w-0 flex-1 rounded-xl border border-[#E6E8EB] bg-white px-4 py-3 text-[1.3rem] leading-8 text-[#11181C] placeholder:text-[#687076] focus:border-[#FFAC1C] focus:outline-none focus:ring-2 focus:ring-[#FFAC1C]"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-[#FFAC1C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#FFB84D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2"
        >
          Track Shipment
        </button>
      </div>
      {checked ? (
        <p className="mt-4 text-[1.3rem] leading-8 text-[#687076]">
          Web lookup is not connected yet. Track {checked} in the{' '}
          <Link href="/download-app" className="font-semibold text-[#11181C] underline">
            app
          </Link>
          .
        </p>
      ) : null}
    </form>
  );
}
