"use client"

interface SparklineProps {
  points: number[]
  color?: string
  width?: number
  height?: number
}

export function Sparkline({ points, color = "currentColor", width = 80, height = 28 }: SparklineProps) {
  if (points.length < 2) return null
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const step = width / (points.length - 1)
  const coords = points.map((v, i) => [
    i * step,
    height - ((v - min) / range) * (height - 4) - 2,
  ])
  const d = "M" + coords.map((c) => c.map((n) => n.toFixed(1)).join(",")).join(" L")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
