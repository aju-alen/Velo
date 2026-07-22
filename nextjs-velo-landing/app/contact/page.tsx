import { buildMetadata, getPageConfig } from '@/lib/seo';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/seo/JsonLd';
import { buildSchemas } from '@/lib/seo';
import { getPageContent } from '@/content/pages';

const slug = 'contact';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

export default function ContactPage() {
  const schemas = buildSchemas(config, getPageContent(slug));
  return (
    <>
      <JsonLd data={schemas} />
      <ContactForm />
    </>
  );
}
