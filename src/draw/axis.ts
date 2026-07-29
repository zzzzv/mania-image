import type { Context, AxisConfig } from '../types'

export function defaultAxisDraw(
  canvas: CanvasRenderingContext2D,
  ctx: Context,
  time: number,
  label: string,
  config: AxisConfig,
): void {
  const y = ctx.timeToY(time)
  const x = ctx.contentWidth - config.width
  const seconds = Math.floor((time % 60000) / 1000)
  const style = seconds === 0 ? config.minute : config.second
  const lineEndX = x + config.width / 5

  // Draw tick line
  canvas.strokeStyle = style.color
  canvas.lineWidth = style.strokeWidth
  canvas.beginPath()
  canvas.moveTo(x, y)
  canvas.lineTo(lineEndX, y)
  canvas.stroke()

  // Draw label
  canvas.fillStyle = style.color
  canvas.font = `bold ${style.fontSize}px ${config.fontFamily}`
  canvas.textAlign = 'center'
  canvas.textBaseline = 'middle'
  canvas.fillText(label, x + config.width / 2, y)
}
