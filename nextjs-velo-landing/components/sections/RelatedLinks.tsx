import Link from 'next/link';
import { getPageConfigByPath } from '@/lib/seo';

type RelatedLinksProps = {
  paths: string[];
};

export default function RelatedLinks({ paths }: RelatedLinksProps) {
  if (paths.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Related pages</h2>
      <div className="flex flex-wrap gap-3">
        {paths.map((path) => {
          const page = getPageConfigByPath(path);
          const label = page?.footerLabel ?? page?.h1 ?? path;
          return (
            <Link
              key={path}
              href={path}
              className="text-sm font-medium text-black bg-gray-100 hover:bg-[#FFAC1C]/20 px-4 py-2 rounded-full transition-colors"
            >
              {label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
