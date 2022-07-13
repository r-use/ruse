/**
 * Increase string a value with unit
 * Adapted from https://github1s.com/vueuse/vueuse/blob/main/packages/shared/utils/index.ts#L70-L88
 *
 * @example '2px' + 1 = '3px'
 * @example '15em' + (-2) = '13em'
 */
export function increaseWithUnit(target: number, delta: number): number;
export function increaseWithUnit(target: string, delta: number): string;
export function increaseWithUnit(target: string | number, delta: number): string | number;
export function increaseWithUnit (target: string | number, delta: number): string | number {
  if (typeof target === "number") { return target + delta; }
  const value = target.match(/^-?[0-9]+\.?[0-9]*/)?.[0] || "";
  const unit = target.slice(value.length);
  const result = (parseFloat(value) + delta);
  if (Number.isNaN(result)) { return target; }
  return result + unit;
}
