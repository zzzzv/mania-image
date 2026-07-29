import type { Beatmap, Context, LayoutConfig } from './types'
import type { Options } from './options'

// ============================================================
// Constants
// ============================================================

const MAX_STRIP_NUM = 50

// ============================================================
// ResolvedState
// ============================================================

export interface LayoutResult {
  stripNum: number
  stripWidth: number
  stripHeight: number
  margin: number
  totalWidth: number
  totalHeight: number
  finalScale: number
  offsetX: number
  offsetY: number
  background: { color: string }
}

export interface ResolvedState {
  strip: Context
  layout: LayoutResult
  options: Options
}

// ============================================================
// resolveOptions
// ============================================================

export function resolveOptions(
  beatmap: Beatmap,
  options: Options,
): ResolvedState {
  const noteWidth = typeof options.note === 'object' ? options.note.width : 20
  const axisWidth = typeof options.axis === 'object' ? options.axis.width : 30
  const keys = beatmap.keys
  const { notes } = beatmap

  const startTime = options.time.start === 'auto'
    ? Math.min(...notes.map(n => n.startTime), 0)
    : options.time.start
  const endTime = options.time.end === 'auto'
    ? Math.max(...notes.map(n => n.endTime ?? n.startTime))
    : options.time.end

  const scale = options.time.scale
  const duration = endTime - startTime
  const contentWidth = Math.ceil(noteWidth * keys + axisWidth)
  const contentHeight = Math.ceil(duration * scale)

  const strip = {
    startTime, endTime, scale, keys,
    contentWidth, contentHeight,
    noteAreaWidth: Math.ceil(noteWidth * keys),
    timeToY: (t: number) => contentHeight - (t - startTime) * scale,
  }

  const layout = resolveLayout(contentWidth, contentHeight, scale, options.layout as LayoutConfig)

  return { strip, layout, options }
}

function resolveLayout(
  contentWidth: number,
  contentHeight: number,
  scale: number,
  cfg: LayoutConfig,
): LayoutResult {
  const margin = cfg.margin
  const bg = cfg.background ?? { color: '#000000' }
  const stripWidth = contentWidth
  const duration = contentHeight / scale
  let stripNum: number

  if (cfg.mode === 'num') {
    stripNum = Math.min(Math.max(cfg.num, 1), MAX_STRIP_NUM)
  } else if (cfg.mode === 'time') {
    stripNum = Math.ceil(duration / cfg.time)
    stripNum = Math.min(Math.max(stripNum, 1), MAX_STRIP_NUM)
  } else if (cfg.mode === 'ratio') {
    const getRatio = (n: number) => (stripWidth * n + margin * 2) / (contentHeight / n + margin * 2)
    stripNum = findStripNum(getRatio, cfg.ratio)
  } else {
    // mode: 'size'
    const [targetW, targetH] = cfg.size
    const contentTargetW = targetW - margin * 2
    const contentTargetH = targetH - margin * 2
    const targetRatio = contentTargetW / contentTargetH
    const getRatio = (n: number) => (stripWidth * n) / (contentHeight / n)
    stripNum = findStripNum(getRatio, targetRatio)

    const stripH = contentHeight / stripNum
    const contentW = stripWidth * stripNum
    const scaleX = contentTargetW / contentW
    const scaleY = contentTargetH / stripH
    const finalScale = Math.min(scaleX, scaleY, 1)
    const scaledW = contentW * finalScale
    const scaledH = stripH * finalScale
    const extraW = targetW - (scaledW + margin * 2)
    const extraH = targetH - (scaledH + margin * 2)

    return {
      stripNum,
      stripWidth,
      stripHeight: Math.ceil(stripH),
      margin,
      totalWidth: targetW,
      totalHeight: targetH,
      finalScale,
      offsetX: margin + extraW / 2,
      offsetY: margin + extraH / 2,
      background: bg,
    }
  }

  const stripHeight = Math.ceil(contentHeight / stripNum)
  return {
    stripNum,
    stripWidth,
    stripHeight,
    margin,
    totalWidth: stripWidth * stripNum + margin * 2,
    totalHeight: stripHeight + margin * 2,
    finalScale: 1,
    offsetX: margin,
    offsetY: margin,
    background: bg,
  }
}

/** Find stripNum whose content ratio best matches targetRatio */
function findStripNum(getRatio: (n: number) => number, targetRatio: number): number {
  let n = 1
  let lastRatio = 0
  while (n <= MAX_STRIP_NUM) {
    const currentRatio = getRatio(n)
    if (currentRatio >= targetRatio) {
      if (n > 1 && targetRatio - lastRatio > currentRatio - targetRatio) {
        n--
      }
      break
    }
    lastRatio = currentRatio
    n++
  }
  return Math.min(n, MAX_STRIP_NUM)
}
