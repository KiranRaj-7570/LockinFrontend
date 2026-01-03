const DonutProgress = ({ percentage, size = 44, stroke = 6 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // color based on progress
  const color =
    percentage >= 70
      ? "#22c55e" // green
      : percentage >= 40
      ? "#facc15" // yellow
      : "#fc0505"; // red

  return (
    <svg width={size} height={size}>
      {/* background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#27272a"
        strokeWidth={stroke}
        fill="none"
       
      />

      {/* progress ring */}
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

      {/* percentage text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="black"
        fontSize="10"
        fontWeight="500"
        className="saira"
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default DonutProgress;
