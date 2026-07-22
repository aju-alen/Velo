import type { BlogMeta } from '@/types/wireframe';

type BlogHeaderProps = {
  title: string;
  meta: BlogMeta;
};

export default function BlogHeader({ title, meta }: BlogHeaderProps) {
  return (
    <header className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#FFAC1C] mb-3">{meta.category}</p>
      <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-4">{title}</h1>
      <time className="text-sm text-gray-500">{meta.date}</time>
    </header>
  );
}
