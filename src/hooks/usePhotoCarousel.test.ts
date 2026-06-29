import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePhotoCarousel } from "./usePhotoCarousel";

const TEST_INTERVAL = 3000;

describe("usePhotoCarousel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with activeIndex 0", () => {
    const { result } = renderHook(() => usePhotoCarousel(4));
    expect(result.current.activeIndex).toBe(0);
  });

  it("selects a specific index and resets the autoplay timer", () => {
    const { result } = renderHook(() =>
      usePhotoCarousel(4, { interval: TEST_INTERVAL }),
    );

    // Let autoplay approach the first change, then select a different index.
    act(() => {
      vi.advanceTimersByTime(TEST_INTERVAL - 1);
    });

    act(() => {
      result.current.select(2);
    });

    expect(result.current.activeIndex).toBe(2);

    // Timer was reset, so advancing by almost the full interval stays on 2.
    act(() => {
      vi.advanceTimersByTime(TEST_INTERVAL - 2);
    });
    expect(result.current.activeIndex).toBe(2);

    // Cross the reset timer.
    act(() => {
      vi.advanceTimersByTime(3);
    });
    expect(result.current.activeIndex).toBe(3);
  });

  it("advances circularly with next()", () => {
    const { result } = renderHook(() => usePhotoCarousel(3));

    act(() => {
      result.current.next();
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.next();
    });
    expect(result.current.activeIndex).toBe(2);

    act(() => {
      result.current.next();
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("goes back circularly with prev()", () => {
    const { result } = renderHook(() => usePhotoCarousel(3));

    act(() => {
      result.current.prev();
    });
    expect(result.current.activeIndex).toBe(2);

    act(() => {
      result.current.prev();
    });
    expect(result.current.activeIndex).toBe(1);
  });

  it("autoplays after the interval using fake timers", () => {
    const { result } = renderHook(() =>
      usePhotoCarousel(3, { interval: TEST_INTERVAL }),
    );

    expect(result.current.isAutoPlaying).toBe(true);

    act(() => {
      vi.advanceTimersByTime(TEST_INTERVAL);
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      vi.advanceTimersByTime(TEST_INTERVAL);
    });
    expect(result.current.activeIndex).toBe(2);

    act(() => {
      vi.advanceTimersByTime(TEST_INTERVAL);
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("does not autoplay with only one photo", () => {
    const { result } = renderHook(() =>
      usePhotoCarousel(1, { interval: TEST_INTERVAL }),
    );

    expect(result.current.isAutoPlaying).toBe(false);

    act(() => {
      vi.advanceTimersByTime(TEST_INTERVAL * 2);
    });

    expect(result.current.activeIndex).toBe(0);
  });

  it("disables autoplay when reduced motion is preferred", () => {
    const { result } = renderHook(() =>
      usePhotoCarousel(4, { interval: TEST_INTERVAL, reducedMotion: true }),
    );

    expect(result.current.isAutoPlaying).toBe(false);

    act(() => {
      vi.advanceTimersByTime(TEST_INTERVAL * 2);
    });

    expect(result.current.activeIndex).toBe(0);
  });
});
