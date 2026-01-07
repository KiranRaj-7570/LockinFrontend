const DonutProgress = ({ percentage, size = 56, stroke = 5 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on progress
  const color =
    percentage >= 70
      ? "#22c55e" // green
      : percentage >= 40
      ? "#eab308" // yellow
      : "#ef4444"; // red

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="filter drop-shadow-lg">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#334155"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
        {/* Percentage text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={size > 44 ? "14" : "12"}
          fontWeight="700"
          className="font-bold"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
};

export default DonutProgress;