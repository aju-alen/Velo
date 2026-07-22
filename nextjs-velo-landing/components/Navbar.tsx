'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { mainNav, type NavDropdown, type NavItem } from '@/lib/seo/navigation';

function isDropdown(item: NavItem): item is NavDropdown {
  return 'items' in item;
}

const linkClass = 'text-gray-700 hover:text-black transition-colors font-medium';
const mobileLinkClass = 'block py-3 text-gray-700 hover:text-black transition-colors font-medium border-b border-gray-100';

function DesktopDropdown({
  dropdown,
  isOpen,
  onToggle,
  onClose,
}: {
  dropdown: NavDropdown;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        if (!isOpen) onToggle();
      }}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        className={`${linkClass} flex items-center gap-1`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={onToggle}
      >
        {dropdown.label}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="min-w-[260px] bg-white border border-gray-200 rounded-lg shadow-lg py-2">
            {dropdown.items.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileAccordion({
  dropdown,
  isExpanded,
  onToggle,
  onLinkClick,
}: {
  dropdown: NavDropdown;
  isExpanded: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
}) {
  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        className={`${mobileLinkClass} w-full flex items-center justify-between border-b-0`}
        aria-expanded={isExpanded}
        aria-haspopup="true"
        onClick={onToggle}
      >
        {dropdown.label}
        <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="pb-2 pl-4">
          {dropdown.items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 text-sm text-gray-600 hover:text-black transition-colors"
              onClick={onLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const closeAll = useCallback(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAll();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeAll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3 shrink-0" onClick={closeAll}>
            <Image src="/logo.png" alt="Velo logo" width={64} height={40} className="w-16 h-10" />
            <div>
              <span className="text-2xl font-bold text-black">VELO</span>
              <div className="text-xs text-gray-600 font-medium tracking-wide">INTERNATIONAL SHIPPING</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {mainNav.map((item) =>
              isDropdown(item) ? (
                <DesktopDropdown
                  key={item.label}
                  dropdown={item}
                  isOpen={openDropdown === item.label}
                  onToggle={() => setOpenDropdown((current) => (current === item.label ? null : item.label))}
                  onClose={() => setOpenDropdown(null)}
                />
              ) : (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 text-gray-700 hover:text-black transition-colors"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-gray-200 bg-white max-h-[calc(100vh-5rem)] overflow-y-auto"
          aria-label="Mobile navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
            {mainNav.map((item) =>
              isDropdown(item) ? (
                <MobileAccordion
                  key={item.label}
                  dropdown={item}
                  isExpanded={mobileExpanded === item.label}
                  onToggle={() => setMobileExpanded((current) => (current === item.label ? null : item.label))}
                  onLinkClick={closeAll}
                />
              ) : (
                <Link key={item.href} href={item.href} className={mobileLinkClass} onClick={closeAll}>
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
