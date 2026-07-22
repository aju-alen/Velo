import type { H2Config } from '@/types/seo';

type BlogTocProps = {
  items: H2Config[];
};

export default function BlogToc({ items }: BlogTocProps) {
  if (items.length === 0) return null;

  const links = (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="text-gray-600 hover:text-black transition-colors">
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
  <>
    <nav className="hidden md:block mb-10 p-6 rounded-xl bg-gray-50 border border-gray-200">
      <p className="font-semibold text-black mb-3">Table of Contents</p>
      {links}
    </nav>
    <details className="md:hidden mb-10 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
      <summary className="cursor-pointer px-6 py-4 font-semibold text-black min-h-11 flex items-center">
        Table of Contents
      </summary>
      <div className="px-6 pb-4">{links}</div>
    </details>
  </>
  );
}
