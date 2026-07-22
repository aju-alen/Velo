import type { TableData } from '@/types/wireframe';
import SectionLabel from './SectionLabel';

type ScrollableTableProps = {
  data: TableData;
  label?: string;
};

export default function ScrollableTable({ data, label = 'Details' }: ScrollableTableProps) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">{data.title}</h2>
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              {data.columns.map((col) => (
                <th key={col.key} className="py-3 px-4 text-sm font-semibold text-black">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                {data.columns.map((col) => (
                  <td key={col.key} className="py-4 px-4 text-sm text-gray-600">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
