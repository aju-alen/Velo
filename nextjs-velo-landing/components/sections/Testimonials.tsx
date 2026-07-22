import type { Testimonial } from '@/types/wireframe';
import SectionLabel from './SectionLabel';

type TestimonialsProps = {
  title?: string;
  items: Testimonial[];
};

export default function Testimonials({ title = 'What Our Customers Say', items }: TestimonialsProps) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>Testimonials</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <blockquote key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-gray-700 leading-relaxed mb-4">&ldquo;{item.quote}&rdquo;</p>
            <footer>
              <p className="font-semibold text-black">{item.author}</p>
              {item.role && <p className="text-sm text-gray-500">{item.role}</p>}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
