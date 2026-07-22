type ContentSectionProps = {
  id: string;
  title: string;
  body: string;
};

export default function ContentSection({ id, title, body }: ContentSectionProps) {
  return (
    <section id={id} className="scroll-mt-28 py-8 border-b border-gray-100 last:border-0">
      <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>
      <div className="text-gray-600 leading-relaxed whitespace-pre-line">{body}</div>
    </section>
  );
}
