import { getAllPages } from './pages';

export type NavLink = { label: string; href: string };
export type NavDropdown = { label: string; items: NavLink[] };
export type NavItem = NavLink | NavDropdown;

const servicesNavLabels: Record<string, string> = {
  '/air-freight-dubai-to-kenya': 'Air Freight Dubai to Kenya',
  '/sea-freight-dubai-to-kenya': 'Sea Freight Dubai to Kenya',
  '/door-to-door-shipping-kenya': 'Door-to-Door Shipping to Kenya',
  '/package-pickup-dubai': 'Package Pickup Dubai',
};

const routesNavLabels: Record<string, string> = {
  '/shipping-from-dubai-to-kenya': 'Shipping from Dubai to Kenya',
  '/cargo-services-dubai-to-nairobi': 'Cargo Services Dubai to Nairobi',
};

export function getNavDropdownItems(group: 'services' | 'routes'): NavLink[] {
  const labelMap = group === 'services' ? servicesNavLabels : routesNavLabels;
  const order = Object.keys(labelMap);
  const pages = getAllPages().filter((p) => p.footerGroup === group && !p.noindex);

  return order
    .map((path) => {
      const page = pages.find((p) => p.path === path);
      if (!page) return null;
      return { label: labelMap[path] ?? page.footerLabel ?? page.h1, href: path };
    })
    .filter((item): item is NavLink => item !== null);
}

export const mainNav: NavItem[] = [
  { label: 'Services', items: getNavDropdownItems('services') },
  { label: 'Routes', items: getNavDropdownItems('routes') },
  { label: 'Business Shipping', href: '/business-shipping' },
  { label: 'Pricing', href: '/pricing-calculator' },
  { label: 'Track Shipment', href: '/track-shipment' },
  { label: 'App', href: '/download-app' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];
