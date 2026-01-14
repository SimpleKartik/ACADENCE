'use client';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  title?: string;
  maxValue?: number;
}

export default function SimpleBarChart({ data, title, maxValue }: SimpleBarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-background-light p-6 rounded-lg border border-gray-200">
      {title && <h3 className="text-lg font-semibold text-primary-900 mb-4">{title}</h3>}
      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available</p>
        ) : (
          data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="text-gray-600">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.color || 'bg-primary-600'
                  }`}
                  style={{ width: `${(item.value / max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
