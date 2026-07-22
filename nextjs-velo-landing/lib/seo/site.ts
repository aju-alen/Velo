export const siteConfig = {
  name: 'Velo',
  legalName: 'Velo Shipping',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://velointl.com',
  logo: '/logo.png',
  email: 'support@velointl.com',
  phone: '+971-000-0000',
  address: {
    street: 'Unit 201, Level 1, Zone South - Avenue G',
    city: 'Dubai',
    region: 'DIFC',
    country: 'AE',
  },
  sameAs: [] as string[],
  app: {
    name: 'Velo',
    operatingSystem: 'iOS, Android',
    applicationCategory: 'BusinessApplication',
  },
};
