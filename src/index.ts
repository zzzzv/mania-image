// Data types & config types
export type {
  Note, TimingPoint, Beatmap,
  Context as StripContext,
  NoteConfig, NoteDraw, ColorConfig,
  BarLineConfig, BarLineDraw,
  AxisConfig, AxisDraw,
  LayoutConfig,
} from './types'

// Options
export type { Options } from './options'
export { defaultOptions } from './options'

// Utils
export type { DeepPartial } from './utils'
export { deepMerge } from './utils'

// Draw functions
export {
  defaultNoteDraw, defaultBarLineDraw, defaultAxisDraw,
  colorSelector, resolveColorConfig, generateBarLinePositions,
} from './draw'

// Resolution
export type { ResolvedState, LayoutResult } from './resolve'
export { resolveOptions } from './resolve'

// Render
export { render, renderContent } from './render'
export type { RenderContentContext } from './render'