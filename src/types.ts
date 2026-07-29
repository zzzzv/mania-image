// ============================================================
// Beatmap data types
// ============================================================

export interface Note {
  readonly column: number
  readonly startTime: number
  readonly endTime?: number
}

export interface TimingPoint {
  readonly time: number
  readonly beatLength: number
  readonly meter: number
}

export interface Beatmap {
  readonly keys: number
  readonly notes: readonly Note[]
  readonly timingPoints: readonly TimingPoint[]
}

// ============================================================
// Contexts
// ============================================================

export interface Context {
  startTime: number
  endTime: number
  scale: number
  keys: number
  contentWidth: number
  contentHeight: number
  noteAreaWidth: number
  timeToY(time: number): number
}

// ============================================================
// Note config
// ============================================================

export type ColorConfig = string | {
  schemes: Record<string, string>
  layouts: Record<number, string>
} | (
  (keys: number, note: { column: number }) => string
)

export type NoteDraw = (
  canvas: CanvasRenderingContext2D,
  ctx: Context,
  note: { column: number; startTime: number; endTime?: number }
) => void

export type NoteConfig = {
  width: number
  height: number
  rx: number
  bodyWidth: number
  color: {
    head: ColorConfig
    body: ColorConfig
  }
}

// ============================================================
// Other group configs
// ============================================================

export type BarLineDraw = (
  canvas: CanvasRenderingContext2D,
  ctx: Context,
  time: number,
) => void

export type BarLineConfig = {
  strokeWidth: number
  color: string
}

export type AxisDraw = (
  canvas: CanvasRenderingContext2D,
  ctx: Context,
  time: number,
  label: string,
) => void

export type AxisConfig = {
  width: number
  fontFamily: string
  minute: { color: string; strokeWidth: number; fontSize: number }
  second: { color: string; strokeWidth: number; fontSize: number }
}

// ============================================================
// Layout config
// ============================================================

export type LayoutConfig = {
  margin: number
  background: { color: string }
} & ({
  mode: 'num'
  num: number
} | {
  mode: 'time'
  time: number
} | {
  mode: 'ratio'
  ratio: number
} | {
  mode: 'size'
  size: [number, number]
})