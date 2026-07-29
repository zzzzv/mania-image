import type { Context, ColorConfig, NoteConfig } from '../types'

export function defaultNoteDraw(
  canvas: CanvasRenderingContext2D,
  ctx: Context,
  note: { column: number; startTime: number; endTime?: number },
  config: NoteConfig,
): void {
  const { width, height, rx, bodyWidth, color } = config
  const x = note.column * width
  const y = ctx.timeToY(note.startTime)
  const headY = y - height
  const keys = ctx.keys

  // Draw note head
  const headColor = resolveColorConfig(color.head, keys, note)
  roundRect(canvas, x, headY, width, height, rx)
  canvas.fillStyle = headColor
  canvas.fill()

  // Draw LN body
  if (note.endTime) {
    const bodyX = x + (width - bodyWidth) / 2
    const bodyTop = ctx.timeToY(note.endTime)
    const bodyH = headY - bodyTop

    if (bodyH > 0) {
      const bodyColor = resolveColorConfig(color.body, keys, note)
      canvas.fillStyle = bodyColor
      canvas.fillRect(bodyX, bodyTop, bodyWidth, bodyH)
    }
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

export function resolveColorConfig(
  cfg: ColorConfig,
  keys: number,
  note: { column: number },
): string {
  if (typeof cfg === 'string') return cfg
  if (typeof cfg === 'function') return cfg(keys, note)
  return colorSelector(cfg.schemes, cfg.layouts, keys, note)
}

export function colorSelector(
  schemes: Record<string, string>,
  layouts: Record<number, string>,
  keys: number,
  note: { column: number },
): string {
  const layout = layouts[keys]
  if (!layout) throw new Error(`Unsupported keys: ${keys}`)
  const colorKey = layout[note.column]
  if (!colorKey) throw new Error(`Invalid column: ${note.column} for ${keys}K`)
  return schemes[colorKey]
}
