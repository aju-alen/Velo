import type { FaqItem } from '@/types/seo';
import { siteConfig } from '../site';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    sameAs: siteConfig.sameAs,
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/track-shipment`,
      'query-input': 'required name=tracking_number',
    },
  };
}

export function buildFaqSchema(faqs: FaqItem[]) {
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function buildServiceSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${siteConfig.url}${url}`,
    provider: { '@type': 'Organization', name: siteConfig.legalName },
    areaServed: ['AE', 'KE'],
  };
}

export function buildSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.app.name,
    operatingSystem: siteConfig.app.operatingSystem,
    applicationCategory: siteConfig.app.applicationCategory,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.legalName,
    image: `${siteConfig.url}${siteConfig.logo}`,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
  };
}

export function buildArticleSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${siteConfig.url}${url}`,
    author: { '@type': 'Organization', name: siteConfig.legalName },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}${siteConfig.logo}` },
    },
  };
}
