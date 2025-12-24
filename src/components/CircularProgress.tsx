interface CircularProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    showPercentage?: boolean;
}

export default function CircularProgress({
    percentage,
    size = 120,
    strokeWidth = 10,
    color = "#3B82F6",
    showPercentage = true,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    // Color based on percentage
    const getColor = () => {
        if (percentage >= 80) return "#EF4444"; // Red - high risk
        if (percentage >= 60) return "#F59E0B"; // Amber - medium-high
        if (percentage >= 40) return "#F59E0B"; // Yellow - medium
        if (percentage >= 20) return "#3B82F6"; // Blue - low
        return "#10B981"; // Green - very low/none
    };

    const strokeColor = color === "auto" ? getColor() : color;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="progress-ring">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted/30"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="progress-ring-circle"
                />
            </svg>
            {showPercentage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: strokeColor }}>
                        {Math.round(percentage)}
                    </span>
                    <span className="text-xs text-muted-foreground">score</span>
                </div>
            )}
        </div>
    );
}
