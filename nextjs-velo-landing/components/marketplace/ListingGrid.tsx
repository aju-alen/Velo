'use client';

import { useEffect, useState } from 'react';
import { WEB_MARKETPLACE_CATEGORIES_ENDPOINT, webMarketplaceListingsEndpoint } from '@/lib/api';
import ListingDescription from './ListingDescription';

type PublicListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  imageUrl: string | null;
  createdAt: string;
  categoryId: string;
};

type MarketplaceCategory = {
  id: string;
  name: string;
};

function formatPrice(price: number) {
  return `AED ${price.toLocaleString('en-AE')}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ListingGrid() {
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMarketplace() {
      setLoading(true);
      setFailed(false);
      try {
        const [categoryResponse, listingResponse] = await Promise.all([
          fetch(WEB_MARKETPLACE_CATEGORIES_ENDPOINT, { cache: 'no-store' }),
          fetch(webMarketplaceListingsEndpoint(selectedCategoryId), { cache: 'no-store' }),
        ]);

        if (!categoryResponse.ok || !listingResponse.ok) {
          throw new Error('Marketplace request failed');
        }

        const categoryData = (await categoryResponse.json()) as { categories?: MarketplaceCategory[] };
        const listingData = (await listingResponse.json()) as { listingData?: PublicListing[] };
        if (!active) return;
        setCategories(Array.isArray(categoryData.categories) ? categoryData.categories : []);
        setListings(Array.isArray(listingData.listingData) ? listingData.listingData : []);
      } catch {
        if (active) {
          setFailed(true);
          setListings([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMarketplace();

    return () => {
      active = false;
    };
  }, [selectedCategoryId]);

  return (
    <div>
      <div className="mb-8 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Listing categories">
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategoryId === ''}
          onClick={() => setSelectedCategoryId('')}
          className={`shrink-0 rounded-xl px-4 py-2 text-[1.3rem] leading-8 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2 ${
            selectedCategoryId === ''
              ? 'bg-[#FFAC1C] text-[#11181C]'
              : 'border border-[#E6E8EB] bg-white text-[#11181C] hover:border-[#FFAC1C]'
          }`}
        >
          All
        </button>
        {categories.map((category) => {
          const selected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-[1.3rem] leading-8 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2 ${
                selected
                  ? 'bg-[#FFAC1C] text-[#11181C]'
                  : 'border border-[#E6E8EB] bg-white text-[#11181C] hover:border-[#FFAC1C]'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-[1.3rem] leading-8 text-[#687076]">Loading listings...</p>
      ) : failed ? (
        <p className="text-[1.3rem] leading-8 text-[#687076]">
          Listings are unavailable right now. Check back shortly.
        </p>
      ) : listings.length === 0 ? (
        <p className="text-[1.3rem] leading-8 text-[#687076]">
          {selectedCategoryId
            ? 'No listings in this category yet.'
            : 'No listings yet. New marketplace posts from the app will show up here.'}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {listings.map((listing) => (
            <article key={listing.id} className="overflow-hidden rounded-2xl border border-[#E6E8EB] bg-white">
              {listing.imageUrl ? (
                <img src={listing.imageUrl} alt={listing.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-[#FFF3E0] text-[#FFAC1C]">No photo</div>
              )}
              <div className="p-6">
                <p className="mb-3 text-sm font-semibold text-[#FFAC1C]">
                  {listing.condition === 'USED' ? 'Used' : 'New'}
                </p>
                <h3 className="mb-2 text-2xl font-bold leading-8 text-[#11181C]">{listing.title}</h3>
                <ListingDescription text={listing.description} />
                <div className="mt-4 flex items-center justify-between gap-3 text-[1.1rem] leading-7 text-[#11181C]">
                  <span className="font-semibold">{formatPrice(listing.price)}</span>
                  <span className="text-[#687076]">{formatDate(listing.createdAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
