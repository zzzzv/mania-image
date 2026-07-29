import type { TimingPoint, Context, BarLineConfig } from '../types'

export function defaultBarLineDraw(
  canvas: CanvasRenderingContext2D,
  ctx: Context,
  time: number,
  config: BarLineConfig,
): void {
  const y = ctx.timeToY(time)
  canvas.strokeStyle = config.color
  canvas.lineWidth = config.strokeWidth
  canvas.beginPath()
  canvas.moveTo(0, y)
  canvas.lineTo(ctx.noteAreaWidth, y)
  canvas.stroke()
}

export function generateBarLinePositions(
  timingPoints: readonly TimingPoint[],
  start: number,
  end: number,
): number[] {
  const sorted = [...timingPoints].sort((a, b) => a.time - b.time)
  const positions: number[] = []

  for (let i = 0; i < sorted.length; i++) {
    const tp = sorted[i]
    const nextTime = i < sorted.length - 1 ? sorted[i + 1].time : end
    const barLength = tp.beatLength * tp.meter

    for (let t = tp.time; t < nextTime && t <= end; t += barLength) {
      if (t >= start) {
        positions.push(t)
      }
    }
  }

  return positions
}
