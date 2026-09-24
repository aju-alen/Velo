import { MARKETPLACE_LISTINGS_ENDPOINT } from '@/lib/api';
import ListingDescription from './ListingDescription';

type PublicListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  imageUrl: string | null;
  createdAt: string;
};

function formatPrice(price: number) {
  return `AED ${price.toLocaleString('en-AE')}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function getListings(): Promise<{ listings: PublicListing[]; failed: boolean }> {
  try {
    const response = await fetch(MARKETPLACE_LISTINGS_ENDPOINT, { cache: 'no-store' });
    if (!response.ok) return { listings: [], failed: true };
    const data = await response.json();
    return { listings: Array.isArray(data.listingData) ? data.listingData : [], failed: false };
  } catch {
    return { listings: [], failed: true };
  }
}

export default async function ListingGrid() {
  const { listings, failed } = await getListings();

  if (failed) {
    return (
      <p className="text-[1.3rem] leading-8 text-[#687076]">
        Listings are unavailable right now. Check back shortly.
      </p>
    );
  }

  if (listings.length === 0) {
    return (
      <p className="text-[1.3rem] leading-8 text-[#687076]">
        No listings yet. New marketplace posts from the app will show up here.
      </p>
    );
  }

  return (
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
  );
}
