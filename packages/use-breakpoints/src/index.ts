// Adapted from https://github.com/vueuse/vueuse/blob/main/packages/core/useBreakpoints/index.ts
import { increaseWithUnit } from "@r-use/shared";
import { useMediaQuery } from "@r-use/use-media-query";

export * from "./breakpoints";

export type Breakpoints<K extends string = string> = Record<K, number | string>;

export function useBreakpoints<K extends string> (breakpoints: Breakpoints<K>) {
  function getValue (k: K, delta?: number) {
    let v = breakpoints[k];

    if (delta != null) { v = increaseWithUnit(v, delta); }

    if (typeof v === "number") { v = `${v}px`; }

    return v;
  }

  function match (query: string): boolean {
    if (!window) { return false; }
    return window.matchMedia(query).matches;
  }

  const greater = (k: K) => {
    return useMediaQuery(`(min-width: ${getValue(k)})`);
  };

  const shortcutMethods = Object.keys(breakpoints)
    .reduce((shortcuts, k) => {
      Object.defineProperty(shortcuts, k, {
        get: () => greater(k as K),
        enumerable: true,
        configurable: true,
      });
      return shortcuts;
    }, {});

  return {
    greater,
    smaller (k: K) {
      return useMediaQuery(`(max-width: ${getValue(k, -0.1)})`);
    },
    between (a: K, b: K) {
      return useMediaQuery(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`);
    },
    isGreater (k: K) {
      return match(`(min-width: ${getValue(k)})`);
    },
    isSmaller (k: K) {
      return match(`(max-width: ${getValue(k, -0.1)})`);
    },
    isInBetween (a: K, b: K) {
      return match(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`);
    },
    ...shortcutMethods,
  };
}

export type UseBreakpointsReturn<K extends string = string> = {
  greater: (k: K) => boolean
  smaller(k: K): boolean
  between(a: K, b: K): boolean
  isGreater(k: K): boolean
  isSmaller(k: K): boolean
  isInBetween(a: K, b: K): boolean
} & Record<K, boolean>;
