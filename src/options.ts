import type {
  NoteConfig, NoteDraw,
  BarLineConfig, BarLineDraw, AxisConfig, AxisDraw,
  LayoutConfig,
} from './types'

export const defaultOptions = {
  note: {
    width: 20,
    height: 6,
    rx: 2,
    bodyWidth: 10,
    color: {
      head: {
        schemes: {
          a: '#FFFFFF', b: '#5EAEFF', c: '#FFEC5E', d: '#FF3F00',
        },
        layouts: {
          1: 'a', 2: 'aa', 3: 'aba', 4: 'abba', 5: 'abcba',
          6: 'abaaba', 7: 'abacaba', 8: 'abaccaba',
          9: 'dabacabad', 10: 'dabaccabad',
          12: 'dbabaccabadbd', 14: 'dababaccabadabd',
          16: 'dbababaccabadababd', 18: 'dabababaccabadababad',
        },
      },
      body: '#CCCCCC',
    },
  } as NoteConfig | NoteDraw,
  barline: {
    strokeWidth: 1,
    color: '#85F000',
  } as BarLineConfig | BarLineDraw,
  axis: {
    width: 30,
    fontFamily: 'SimHei, "Microsoft YaHei", "Arial Black", sans-serif',
    minute: { color: '#FF3F00', strokeWidth: 2, fontSize: 24 },
    second: { color: '#FFFFFF', strokeWidth: 2, fontSize: 22 },
  } as AxisConfig | AxisDraw,
  time: {
    start: 'auto' as 'auto' | number,
    end: 'auto' as 'auto' | number,
    scale: 0.1,
  },
  layout: {
    margin: 10,
    background: { color: '#000000' },
    mode: 'time',
    time: 15000,
  } as LayoutConfig,
  renderer: {
    devicePixelRatio: 1,
  },
}

export type Options = typeof defaultOptions
