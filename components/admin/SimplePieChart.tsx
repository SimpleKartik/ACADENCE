'use client';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: PieChartData[];
  title?: string;
}

export default function SimplePieChart({ data, title }: SimplePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        {title && <h3 className="text-lg font-semibold text-primary-900 mb-4">{title}</h3>}
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  // Calculate angles for pie chart
  let currentAngle = -90; // Start at top
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return {
      ...item,
      percentage: Math.round(percentage * 10) / 10,
      startAngle,
      angle,
    };
  });

  // Create SVG path for each segment
  const createPath = (startAngle: number, angle: number, radius: number = 80) => {
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, startAngle + angle);
    const largeArcFlag = angle > 180 ? 1 : 0;
    return `M ${radius} ${radius} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: radius + radius * Math.cos(angleInRadians),
      y: radius + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="bg-background-light p-6 rounded-lg border border-gray-200">
      {title && <h3 className="text-lg font-semibold text-primary-900 mb-4">{title}</h3>}
      <div className="flex items-center justify-center space-x-8">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createPath(segment.startAngle, segment.angle)}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        <div className="space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-sm text-gray-700">
                {segment.label}: {segment.value} ({segment.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
