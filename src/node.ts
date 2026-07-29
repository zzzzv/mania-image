import type { Beatmap } from './types'
import type { DeepPartial } from './utils'
import { deepMerge } from './utils'
import { defaultOptions, type Options } from './options'
import { resolveOptions } from './resolve'
import { renderContent, spliceStrips } from './render'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CanvasBundle {
  canvas: any
  ctx: any
}

export function render(
  beatmap: Beatmap,
  createCanvas: (width: number, height: number) => CanvasBundle,
  userOptions: DeepPartial<typeof defaultOptions> = {},
): CanvasBundle {
  const merged = deepMerge(defaultOptions, userOptions)
  const state = resolveOptions(beatmap, merged as Options)
  const { strip, layout } = state
  const dpr = merged.renderer?.devicePixelRatio ?? 1

  const content = createCanvas(strip.contentWidth * dpr, strip.contentHeight * dpr)
  content.ctx.scale(dpr, dpr)
  renderContent({ canvas: content.ctx, beatmap, state })

  const output = createCanvas(layout.totalWidth, layout.totalHeight)
  output.ctx.fillStyle = layout.background.color
  output.ctx.fillRect(0, 0, layout.totalWidth, layout.totalHeight)
  spliceStrips(output.ctx, content.canvas, strip, layout, dpr)

  return output
}
