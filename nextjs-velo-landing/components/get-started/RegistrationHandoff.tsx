import Link from 'next/link';
import { Apple, Smartphone } from 'lucide-react';
import OpenAppLink from '@/components/OpenAppLink';
import { APP_STORE_URL, PLAY_STORE_URL, registrationRoles, type RegistrationPath } from '@/lib/app-links';

const btnPrimary =
  'inline-flex items-center justify-center rounded-xl bg-[#0E5A6B] px-5 py-3 text-[1.3rem] leading-8 font-medium text-white hover:bg-[#0A4A58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E5A6B] focus-visible:ring-offset-2';
const btnSecondary =
  'inline-flex items-center justify-center rounded-xl border border-[#0E5A6B] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#0E5A6B] hover:bg-[#0E5A6B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E5A6B] focus-visible:ring-offset-2';

export default function RegistrationHandoff({ path }: { path: RegistrationPath }) {
  const role = registrationRoles[path];

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#0F202A]">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <p className="mb-3 text-[1.3rem] leading-8 font-medium text-[#0E5A6B]">Velo app</p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl md:leading-[1.25]">{role.title}</h1>
        <p className="mt-6 text-[1.3rem] leading-8 text-[#687076]">{role.description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <OpenAppLink path={path} className={btnPrimary}>
            {role.openLabel}
          </OpenAppLink>
          <Link href="/" className={btnSecondary}>
            Back to home
          </Link>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-[#E6E8EB] bg-white p-6"
          >
            <Apple className="h-7 w-7" />
            <span>
              <span className="block text-sm font-semibold text-[#0E5A6B]">iOS</span>
              <span className="block text-[1.3rem] leading-8 font-medium">Download on the App Store</span>
            </span>
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-[#E6E8EB] bg-white p-6"
          >
            <Smartphone className="h-7 w-7" />
            <span>
              <span className="block text-sm font-semibold text-[#0E5A6B]">Android</span>
              <span className="block text-[1.3rem] leading-8 font-medium">Get it on Google Play</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
