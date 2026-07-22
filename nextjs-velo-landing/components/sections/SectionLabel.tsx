export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#FFAC1C] mb-4">
      {children}
    </span>
  );
}
