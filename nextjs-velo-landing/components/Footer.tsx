import Link from 'next/link';
import Image from 'next/image';
import { getFooterLinks } from '@/lib/seo';

function FooterColumn({ title, group }: { title: string; group: 'routes' | 'services' | 'company' | 'resources' }) {
  const links = getFooterLinks(group);
  if (links.length === 0) return null;

  return (
    <div>
      <h4 className="text-white font-semibold mb-6">{title}</h4>
      <ul className="space-y-3">
        {links.map((page) => (
          <li key={page.path}>
            <Link href={page.path} className="hover:text-[#FFAC1C] transition-colors">
              {page.footerLabel}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Image src="/logo.png" alt="logo" width={64} height={40} className="w-16 h-10" />
              <div>
                <span className="text-2xl font-bold text-white">VELO</span>
                <div className="text-xs text-gray-400 font-medium tracking-wide">INTERNATIONAL SHIPPING</div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Professional international shipping from Dubai to Kenya. Pickup, tracking, and delivery in one place.
            </p>
          </div>
          <FooterColumn title="Routes" group="routes" />
          <FooterColumn title="Services" group="services" />
          <FooterColumn title="Company" group="company" />
          <FooterColumn title="Resources" group="resources" />
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>&copy; 2025 Velo Shipping. All rights reserved.</p>
          <Link href="/account-delete-guide" className="hover:text-[#FFAC1C] transition-colors">
            Account Delete Guide
          </Link>
        </div>
      </div>
    </footer>
  );
}
