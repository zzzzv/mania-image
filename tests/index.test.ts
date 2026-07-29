import { describe, it } from 'vitest'
import { readBeatmapFile } from 'osu-mania-io/node'
import { createCanvas } from '@napi-rs/canvas'
import type { Beatmap } from '../src/types'
import { render } from '../src/node'
import * as fs from 'fs'
import * as path from 'path'

function beatmapFromOsu(file: string): Beatmap {
  const parsed = readBeatmapFile(file)
  return {
    keys: parsed.difficulty.keyCount,
    notes: parsed.hitObjects satisfies Beatmap['notes'],
    timingPoints: parsed.controlPoints
      .filter(cp => cp.kind === 'timing') satisfies Beatmap['timingPoints'],
  }
}

const fixtures = ['ao', 'hana', '重霄']

const layouts = [
  { name: 'num8', opts: { layout: { margin: 10, mode: 'num' as const, num: 8 } } },
  { name: 'time15', opts: { layout: { margin: 10, mode: 'time' as const, time: 15000 } } },
  { name: 'ratio15', opts: { layout: { margin: 10, mode: 'ratio' as const, ratio: 1.5 } } },
  { name: 'size800', opts: { layout: { margin: 10, mode: 'size' as const, size: [800, 600] as [number, number] } } },
]

describe('mania-image', () => {
  for (const name of fixtures) {
    for (const { name: layoutName, opts } of layouts) {
      it(`render ${name}_${layoutName}`, () => {
        const data = beatmapFromOsu(`./tests/${name}.osu`)

        const { canvas } = render(data, (w, h) => {
          const c = createCanvas(w, h)
          return { canvas: c, ctx: c.getContext('2d')! }
        }, opts)

        const outDir = path.resolve(process.cwd(), 'output')
        fs.mkdirSync(outDir, { recursive: true })
        fs.writeFileSync(path.join(outDir, `${name}_${layoutName}.png`), canvas.toBuffer('image/png'))
      })
    }
  }
})
