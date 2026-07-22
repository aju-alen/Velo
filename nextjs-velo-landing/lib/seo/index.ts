import type { PageContent } from '@/types/seo';
import type { SeoPageConfig } from '@/types/seo';
import {
  buildArticleSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildServiceSchema,
  buildSoftwareApplicationSchema,
  buildWebsiteSchema,
} from './schema';
import { buildMetadata } from './metadata';
import { getAllPages, getFooterLinks, getIndexablePages, getPageConfig, getPageConfigByPath } from './pages';

export { siteConfig } from './site';
export { buildMetadata, getAllPages, getFooterLinks, getIndexablePages, getPageConfig, getPageConfigByPath };
export { mainNav, getNavDropdownItems, type NavItem, type NavLink, type NavDropdown } from './navigation';

export function buildSchemas(config: SeoPageConfig, content: PageContent): object[] {
  const schemas: object[] = [];

  for (const type of config.schemaTypes) {
    switch (type) {
      case 'Organization':
        schemas.push(buildOrganizationSchema());
        break;
      case 'WebSite':
        schemas.push(buildWebsiteSchema());
        break;
      case 'FAQPage': {
        const faq = buildFaqSchema(content.faqs);
        if (faq) schemas.push(faq);
        break;
      }
      case 'Service':
        schemas.push(buildServiceSchema(config.h1, config.description, config.path));
        break;
      case 'SoftwareApplication':
        schemas.push(buildSoftwareApplicationSchema());
        break;
      case 'LocalBusiness':
        schemas.push(buildLocalBusinessSchema());
        break;
      case 'Article':
        schemas.push(buildArticleSchema(config.h1, config.description, config.path));
        break;
    }
  }

  return schemas;
}
