'use client';

import { FormEvent, useState } from 'react';
import { trackingEndpoint } from '@/lib/api';

type TrackingStep = {
  key: string;
  label: string;
  completed: boolean;
  current: boolean;
};

type TrackingResult = {
  shipmentId: string;
  statusLabel: string;
  shipmentDate: string;
  deliveryDate: string;
  from: string;
  to: string;
  timeline: TrackingStep[];
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TrackLookup() {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const publicId = number.trim();
    if (!publicId) return;

    setLoading(true);
    setMessage('');
    setResult(null);

    try {
      const response = await fetch(trackingEndpoint(publicId), { cache: 'no-store' });
      if (response.status === 404) {
        setMessage('No shipment found for that tracking number.');
        return;
      }
      if (!response.ok) {
        setMessage('Tracking is unavailable right now.');
        return;
      }

      const data = (await response.json()) as { tracking?: TrackingResult };
      if (!data.tracking) {
        setMessage('No shipment found for that tracking number.');
        return;
      }
      setResult(data.tracking);
    } catch {
      setMessage('Tracking is unavailable right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 max-w-xl" onSubmit={handleSubmit}>
      <label htmlFor="tracking-number" className="mb-2 block text-[1.3rem] font-semibold leading-8 text-[#0F202A]">
        Tracking number
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="tracking-number"
          name="tracking-number"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          placeholder="Enter tracking number"
          required
          className="min-w-0 flex-1 rounded-xl border border-[#E6E8EB] bg-white px-4 py-3 text-[1.3rem] leading-8 text-[#0F202A] placeholder:text-[#687076] focus:border-[#0E5A6B] focus:outline-none focus:ring-2 focus:ring-[#0E5A6B]"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-[#0E5A6B] px-5 py-3 text-[1.3rem] leading-8 font-medium text-white hover:bg-[#0A4A58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E5A6B] focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {loading ? 'Tracking...' : 'Track Shipment'}
        </button>
      </div>
      {message ? <p className="mt-4 text-[1.3rem] leading-8 text-[#687076]">{message}</p> : null}
      {result ? (
        <article className="mt-6 rounded-2xl border border-[#E6E8EB] bg-white p-6">
          <p className="text-[1.3rem] font-semibold leading-8 text-[#0F202A]">{result.shipmentId}</p>
          <p className="text-[1.3rem] font-semibold leading-8 text-[#0E5A6B]">{result.statusLabel}</p>
          <p className="mt-2 text-[1.3rem] leading-8 text-[#0F202A]">
            {result.from || 'Origin'} to {result.to || 'Destination'}
          </p>
          <p className="text-[1.3rem] leading-8 text-[#687076]">
            Shipped {formatDate(result.shipmentDate)} · Est. delivery {formatDate(result.deliveryDate)}
          </p>
          <ol className="mt-4 space-y-2">
            {result.timeline.map((step) => (
              <li
                key={step.key}
                className={`text-[1.3rem] leading-8 ${step.current ? 'font-semibold text-[#0F202A]' : 'text-[#687076]'}`}
              >
                {step.completed || step.current ? '●' : '○'} {step.label}
              </li>
            ))}
          </ol>
        </article>
      ) : null}
    </form>
  );
}
