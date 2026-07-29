export type DeepPartial<T> =
  T extends (infer U)[] ? DeepPartial<U>[]
  : T extends object ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: DeepPartial<T>,
): T {
  const result = { ...target } as Record<string, unknown>
  const src = source as Record<string, unknown>
  for (const key of Object.keys(src)) {
    const val = src[key]
    if (val === undefined) continue
    const targetVal = target[key]
    if (
      val !== null &&
      typeof val === 'object' &&
      !Array.isArray(val) &&
      typeof targetVal === 'object' &&
      targetVal !== null &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        val as Record<string, unknown>,
      )
    } else {
      result[key] = val
    }
  }
  return result as T
}
