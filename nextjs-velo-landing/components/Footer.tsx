import Link from 'next/link';
import Image from 'next/image';
import { mainNav, type NavItem } from '@/lib/seo';

function isDropdown(item: NavItem): item is Extract<NavItem, { items: unknown }> {
  return 'items' in item;
}

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] mb-12">
          <div>
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
          <nav aria-label="Footer">
            <ul className="space-y-3">
              {mainNav.map((item) =>
                isDropdown(item) ? (
                  <li key={item.label}>
                    {item.href ? (
                      <Link href={item.href} className="text-white font-semibold hover:text-[#FFAC1C] transition-colors">
                        {item.label}
                      </Link>
                    ) : (
                      <p className="text-white font-semibold">{item.label}</p>
                    )}
                    <ul className="mt-3 space-y-3 pl-4">
                      {item.items.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="hover:text-[#FFAC1C] transition-colors">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white font-semibold hover:text-[#FFAC1C] transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
        <div className="border-t border-gray-800 pt-8 text-gray-400 text-sm">
          <p>&copy; 2025 Velo Shipping. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
