interface ArabicBorderProps {
  className?: string
  color?: string
}

export default function ArabicBorder({
  className = '',
  color = '#C8991A',
}: ArabicBorderProps) {
  return (
    <div className={`w-full py-4 ${className}`}>
      <svg
        viewBox="0 0 1200 20"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-5"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="arabesque"
            x="0"
            y="0"
            width="40"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            {/* Star/Arabesque pattern */}
            <path
              d="M20 2L24 8L30 8L25 12L27 18L20 14L13 18L15 12L10 8L16 8Z"
              fill="none"
              stroke={color}
              strokeWidth="0.75"
              opacity="0.6"
            />
            <circle cx="20" cy="10" r="2" fill={color} opacity="0.3" />
            {/* Interlocking geometric lines */}
            <line x1="0" y1="10" x2="10" y2="10" stroke={color} strokeWidth="0.5" opacity="0.4" />
            <line x1="30" y1="10" x2="40" y2="10" stroke={color} strokeWidth="0.5" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="1200" height="20" fill="url(#arabesque)" />
      </svg>
    </div>
  )
}
