import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  blogCtaByIntent,
  blogFinalCtaTemplate,
  type BlogArticleIntent,
} from '@/content/wireframes/blog-article-framework';

type DualCtaBlockProps = {
  intent?: BlogArticleIntent;
};

export default function DualCtaBlock({ intent = 'commercial' }: DualCtaBlockProps) {
  const intentCta = blogCtaByIntent[intent];
  const finalCta = blogFinalCtaTemplate;

  return (
    <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#FFAC1C] to-[#FFB84D] p-8 text-center">
      <h2 className="text-2xl font-bold text-black mb-3">{finalCta.headline}</h2>
      <div className="space-y-3 mb-6 max-w-2xl mx-auto">
        {finalCta.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-black/70 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href={intentCta.href}
          className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors font-semibold"
        >
          {intentCta.label}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
        {intent !== 'commercial' && (
          <Link
            href={finalCta.primaryCta.href}
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 bg-white text-black px-7 py-3.5 rounded-full hover:bg-gray-100 transition-colors font-semibold"
          >
            {finalCta.primaryCta.label}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        )}
        {intent === 'commercial' && (
          <Link
            href={blogCtaByIntent.informational.href}
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 bg-white text-black px-7 py-3.5 rounded-full hover:bg-gray-100 transition-colors font-semibold"
          >
            {blogCtaByIntent.informational.label}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
}
