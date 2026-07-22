import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type RelatedArticlesProps = {
  articles: { path: string; title: string }[];
};

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-black mb-6">Related Articles</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link
            key={article.path}
            href={article.path}
            className="group rounded-2xl border border-gray-200 p-6 hover:border-[#FFAC1C]/40 transition-colors"
          >
            <h3 className="font-bold text-black group-hover:text-[#FFAC1C] transition-colors mb-2">{article.title}</h3>
            <span className="inline-flex items-center text-sm font-semibold text-gray-600">
              Read article <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
