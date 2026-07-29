import type { Beatmap } from './types'
import type { DeepPartial } from './utils'
import { deepMerge } from './utils'
import { defaultOptions, type Options } from './options'
import { resolveOptions, type ResolvedState, type LayoutResult } from './resolve'
import { defaultNoteDraw } from './draw/note'
import { defaultBarLineDraw, generateBarLinePositions } from './draw/barline'
import { defaultAxisDraw } from './draw/axis'

export interface RenderContentContext {
  canvas: CanvasRenderingContext2D
  beatmap: Beatmap
  state: ResolvedState
}

/**
 * Draw all beatmap content (notes, bar lines, axis labels, background)
 * onto a canvas context. The canvas should be sized to strip.contentHeight x strip.contentWidth.
 */
export function renderContent(
  rc: RenderContentContext,
): void {
  const { canvas, beatmap, state } = rc
  const { strip, options } = state
  const { startTime } = strip

  const noteConfig = typeof options.note === 'object' ? options.note : null

  // Notes
  if (noteConfig) {
    for (const note of beatmap.notes) {
      defaultNoteDraw(canvas, strip, note, noteConfig)
    }
  }

  // Bar lines
  if (typeof options.barline === 'object') {
    const barLineTimes = generateBarLinePositions(
      beatmap.timingPoints, startTime, strip.endTime,
    )
    for (const t of barLineTimes) {
      defaultBarLineDraw(canvas, strip, t, options.barline)
    }
  }

  // Axis labels
  if (typeof options.axis === 'object') {
    const startSec = Math.ceil(startTime / 1000) * 1000
    const endSec = Math.floor(strip.endTime / 1000) * 1000
    for (let t = startSec; t <= endSec; t += 1000) {
      if (t === 0) continue
      const seconds = Math.floor((t % 60000) / 1000)
      const minutes = Math.floor(t / 60000)
      const label = seconds === 0 ? `${minutes}` : `${seconds}`
      defaultAxisDraw(canvas, strip, t, label, options.axis)
    }
  }
}

/**
 * Strip splicing: drawImage each strip from the content canvas onto the output canvas.
 * Shared between browser render and Node.js render.
 */
export function spliceStrips(
  outputCtx: any,
  contentCanvas: any,
  strip: { contentHeight: number },
  layout: LayoutResult,
): void {
  const { stripNum, stripWidth, stripHeight, finalScale, offsetX, offsetY } = layout
  for (let i = 0; i < stripNum; i++) {
    const sy = strip.contentHeight - (i + 1) * stripHeight
    const sw = stripWidth * finalScale
    const sh = stripHeight * finalScale
    const dx = i * sw + offsetX
    const dy = offsetY
    outputCtx.drawImage(contentCanvas, 0, sy, stripWidth, stripHeight, dx, dy, sw, sh)
  }
}

/**
 * Browser render: resolve options, render to internal OffscreenCanvases,
 * splice strips, and return a PNG Blob.
 */
export async function render(
  beatmap: Beatmap,
  userOptions: DeepPartial<typeof defaultOptions> = {},
): Promise<Blob> {
  const merged = deepMerge(defaultOptions, userOptions)
  const state = resolveOptions(beatmap, merged as Options)
  const { strip, layout } = state

  // 1. Content canvas — full timeline
  const contentCanvas = new OffscreenCanvas(strip.contentWidth, strip.contentHeight)
  const contentCtx = contentCanvas.getContext('2d')! as any
  renderContent({ canvas: contentCtx as any, beatmap, state })

  // 2. Output canvas — spliced strips
  const outputCanvas = new OffscreenCanvas(layout.totalWidth, layout.totalHeight)
  const outputCtx = outputCanvas.getContext('2d')! as any

  // Background (layout-level, on output canvas)
  outputCtx.fillStyle = layout.background.color
  outputCtx.fillRect(0, 0, layout.totalWidth, layout.totalHeight)

  spliceStrips(outputCtx, contentCanvas, strip, layout)

  return outputCanvas.convertToBlob({ type: 'image/png' })
}
